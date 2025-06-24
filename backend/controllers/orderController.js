const Order = require('../models/Order');
const { allocateOrders } = require("../services/allocationService");
const Agent = require("../models/Agent");
const Warehouse = require("../models/Warehouse")
const { faker } = require('@faker-js/faker');
const redisClient = require("../utils/redisClient");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('warehouseId').populate('agentId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('warehouseId').populate('agentId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Create a new order
exports.createOrder = async (req, res) => {
  const { warehouseId, address, latitude, longitude, deliveryDate } = req.body;

  //  Get all available agent IDs from Redis
  const availableAgentIds = await redisClient.sMembers('available_agents');

  if (!availableAgentIds.length) {
    return res.status(400).json({ message: "No agents currently checked in" });
  }

  // Loop and filter eligible agents
  const eligibleAgents = [];

  for (let agentId of availableAgentIds) {
    const agent = await Agent.findById(agentId);
    if (!agent) continue;

    // Get today's session
    const today = new Date().toISOString().split("T")[0];
    const todaySession = agent.sessions.find(s => s.date === today);

    const hoursWorked = todaySession?.hoursWorked ?? 0;
    const kmCovered = todaySession?.kmCovered ?? 0;

    if (hoursWorked < 10 && kmCovered < 100 && agent.warehouseId.toString() === warehouseId) {
      eligibleAgents.push(agent);
    }
  }

  if (eligibleAgents.length === 0) {
    return res.status(400).json({ message: "No eligible agents available" });
  }

  //  Pick a random eligible agent
  const assignedAgent = eligibleAgents[Math.floor(Math.random() * eligibleAgents.length)];

  // Create the order
  const order = await Order.create({
    warehouseId,
    agentId: assignedAgent._id,
    address,
    latitude,
    longitude,
    deliveryDate,
    status: "pending",
    isDispatched: false,
  });

  res.status(201).json({ message: "Order created", order });
};


//  Update order by ID
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Delete order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all orders
exports.deleteAllOrder= async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete orders" });
  }
};
//Order Received
exports.markAsReceived = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "received",
        receivedAt: new Date(),
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order marked as received", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as received" });
  }
};


//Order Delivered
// exports.markAsDelivered = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: "delivered",
//         isDispatched:true,
//         deliveredAt: new Date(),
//         deliveryDate:new Date()
//       },
//       { new: true }
//     );
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.json({ message: "✅ Order marked as delivered", order });
//   } catch (err) {
//     res.status(500).json({ message: " Failed to mark as delivered" });
//   }
// };
exports.markAsDelivered = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order || order.status !== "received") {
      return res.status(400).json({ message: "Invalid order" });
    }

    order.status = "delivered";
    order.deliveredAt = new Date();
    await order.save();

    if (order.agentId) {
      const agent = await Agent.findById(order.agentId);
      if (agent) {
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

        const session = agent.sessions.find((s) => s.date === today);

        if (session) {
          session.checkOutTime = new Date();

          const duration =
            (new Date(session.checkOutTime) - new Date(session.checkInTime)) /
            (1000 * 60 * 60); // in hours

          session.hoursWorked = Math.min(10, duration.toFixed(2)); 
          session.kmCovered = Math.min(100, Math.random() * 100); 
        }
        await agent.save();
      }
    }

    res.json({ message: "Order marked as delivered and agent updated" });
  } catch (err) {
    console.error("Deliver error:", err);
    res.status(500).json({ message: "Failed to deliver order" });
  }
};

exports.allocateOrdersController = async (req, res) => {
  try {
    const agents = await Agent.find(); 
    const orders = await Order.find({ isDispatched: false });

    const result = await allocateOrders(agents, orders)

    res.status(200).json(result);
  } catch (error) {
    console.error("Allocation error:", error);
    res.status(500).json({ message: "Order allocation failed" });
  }
};


exports.createFakeOrders= async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    if (warehouses.length === 0) {
      return res.status(400).json({ message: "No warehouses available." });
    }

    // Create 50 new orders
    for (let i = 0; i < 50; i++) {
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      await Order.create({
        warehouseId: warehouse._id,
        address: faker.address.streetAddress(),
        latitude: warehouse.latitude + Math.random() * 0.1,
        longitude: warehouse.longitude + Math.random() * 0.1,
        isDispatched: false,
        deliveryDate: new Date(),
      });
    }

    res.json({ message: "✅ 50 orders seeded successfully." });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: " Failed to seed orders." });
  }
};

