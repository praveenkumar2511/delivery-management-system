const Agent = require('../models/Agent');
const Order = require('../models/Order');
const LoginStatus = require('../models/LoginStatus');
const redisClient = require("../utils/redisClient");


// Get all agents
exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate("warehouseId").lean();

    for (let agent of agents) {
      const login = await LoginStatus.findOne({
        agentId: agent._id,
        status: true,
      });
      agent.isLoggedIn = !!login;
    }

    res.status(200).json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
};


exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('warehouseId');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an agent by ID
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an agent by ID
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agent Check-In
exports.checkIn = async (req, res) => {
  const agentId = req.params.id;

  const agent = await Agent.findById(agentId);
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  //  Set check-in time and update status
  agent.currentSession = { checkInTime: new Date() };
  agent.isCheckedIn = true; // ✅ Update the field
  await agent.save();

  //  Add agent to Redis available set
  await redisClient.sAdd("available_agents", agentId.toString());

  res.status(200).json({ message: "Checked in", time: agent.currentSession.checkInTime });
};


//  Agent Check-Out
exports.checkOut = async (req, res) => {
  const agentId = req.params.id;
  const agent = await Agent.findById(agentId);
  if (!agent || !agent.currentSession?.checkInTime)
    return res.status(400).json({ message: "No active session found" });

  const checkOutTime = new Date();
  const checkInTime = new Date(agent.currentSession.checkInTime);
  const diffMs = checkOutTime - checkInTime;

  let hoursWorked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  if (hoursWorked > 10) hoursWorked = 10;

  const kmCovered = Math.min(Math.random() * 100, 100);
  const today = new Date().toISOString().split("T")[0];

  const startOfDay = new Date(today + "T00:00:00.000Z");
  const endOfDay = new Date(today + "T23:59:59.999Z");

  const ordersCompleted = await Order.countDocuments({
    agentId,
    status: "delivered",
    deliveredAt: { $gte: startOfDay, $lte: endOfDay },
  });

  agent.sessions.push({
    date: today,
    checkInTime,
    checkOutTime,
    hoursWorked,
    kmCovered,
    ordersCompleted,
  });

  agent.currentSession = null;
  agent.isCheckedIn = false; 
  await agent.save();

  // Remove from Redis
  await redisClient.sRem("available_agents", agentId.toString());

  res.status(200).json({
    message: "Checked out",
    hoursWorked,
    kmCovered,
    ordersCompleted,
  });
};



exports.calculateWages = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const orders = await Order.find({
      agentId: id,
      deliveredAt: { $exists: true },
    });

    // Step 1: Count delivered orders per day
    const ordersByDay = {};
    orders.forEach((order) => {
      const date = new Date(order.deliveredAt).toISOString().split("T")[0];
      ordersByDay[date] = (ordersByDay[date] || 0) + 1;
    });

    // Step 2: Group sessions by day (assume each session has checkInTime, duration, kmCovered)
    const sessionsByDay = {};
    agent.sessions.forEach((session) => {
      const date = new Date(session.checkInTime).toISOString().split("T")[0];
      if (!sessionsByDay[date]) sessionsByDay[date] = [];
      sessionsByDay[date].push(session);
    });

    // Step 3: Calculate daily wage
    const result = [];

    for (const [date, sessions] of Object.entries(sessionsByDay)) {
      const totalHours = sessions.reduce((sum, s) => sum + (s.durationHours || 0), 0);
      const totalKm = sessions.reduce((sum, s) => sum + (s.kmCovered || 0), 0);
      const deliveredOrders = ordersByDay[date] || 0;

      let status = "✅ Eligible";
      let earnings = 500; // Default minimum guarantee

      if (totalHours > 10 || totalKm > 100) {
        status = "❌ Limit exceeded";
        earnings = 0;
      } else {
        if (deliveredOrders >= 50) earnings = deliveredOrders * 42;
        else if (deliveredOrders >= 25) earnings = deliveredOrders * 35;
      }

      result.push({
        date,
        deliveredOrders,
        totalHours,
        totalKm,
        earnings,
        status,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Wage calculation error:", error);
    res.status(500).json({ message: "Failed to calculate wages" });
  }
};

//get wages
exports.getWages = async (req, res) => {
  const agentId = req.params.id;
  console.log(agentId,"pppppppppppppppppppppppp");
  
  const agent = await Agent.findById(agentId);
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  const summary = agent.sessions.map((session) => {
    let perOrderRate = 0;
    let deliveredOrders = Math.floor(Math.random() * 60); // Placeholder
    if (deliveredOrders >= 50) perOrderRate = 42;
    else if (deliveredOrders >= 25) perOrderRate = 35;

    const earnings = deliveredOrders * perOrderRate;
    const totalEarnings = Math.max(500, earnings); // 💰 Min Guarantee

    return {
      date: session.date,
      deliveredOrders,
      totalHours: session.hoursWorked,
      totalKm: session.kmCovered,
      status:
        session.hoursWorked > 10 || session.kmCovered > 100
          ? "❌ Violated limit"
          : "✅ Within limits",
      earnings: totalEarnings,
    };
  });

  res.status(200).json(summary);
};

