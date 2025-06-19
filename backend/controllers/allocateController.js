const Order = require('../models/Order');
const Agent = require('../models/Agent');

// Haversine formula to calculate distance in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371; // Earth's radius in KM

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /allocateOrders
exports.allocateOrders = async (req, res) => {
  try {
    // 1. Load pending orders (for today or earlier)
    const orders = await Order.find({
      isDispatched: false,
      deliveryDate: { $lte: new Date() }
    });

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No pending orders to allocate.' });
    }

    // 2. Load all agents and populate warehouse details
    const agents = await Agent.find().populate('warehouseId');

    const agentPool = agents.map(agent => ({
      ...agent.toObject(),
      availableMinutes: 600, // 10 hours
      kmUsed: 0,
      orders: [],
    }));

    // 3. Allocate orders one by one
    for (const order of orders) {
      const sameWarehouseAgents = agentPool.filter(a =>
        String(a.warehouseId._id) === String(order.warehouseId)
      );

      // Sort by most available time (greedy)
      sameWarehouseAgents.sort((a, b) => b.availableMinutes - a.availableMinutes);

      let allocated = false;

      for (const agent of sameWarehouseAgents) {
        const distanceKm = calculateDistance(
          agent.warehouseId.latitude,
          agent.warehouseId.longitude,
          order.latitude,
          order.longitude
        );

        const travelTime = distanceKm * 5; // 5 mins per KM
        const deliveryTime = 4; // 4 mins per order
        const totalTime = travelTime + deliveryTime;

        if (
          agent.kmUsed + distanceKm <= 100 &&
          agent.availableMinutes - totalTime >= 0
        ) {
          // Allocate
          agent.orders.push(order._id);
          agent.kmUsed += distanceKm;
          agent.availableMinutes -= totalTime;

          await Order.findByIdAndUpdate(order._id, {
            agentId: agent._id,
            isDispatched: true
          });

          allocated = true;
          break;
        }
      }

      // If no agent available, postpone
      if (!allocated) {
        await Order.findByIdAndUpdate(order._id, {
          deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 day
        });
      }
    }

    // 4. Payout calculation
    const payoutSummary = agentPool.map(agent => {
      const totalOrders = agent.orders.length;
      let payout = 500; // Minimum guarantee

      if (totalOrders >= 50) payout += totalOrders * 42;
      else if (totalOrders >= 25) payout += totalOrders * 35;

      return {
        agentId: agent._id,
        agentName: agent.name,
        warehouse: agent.warehouseId.name,
        totalOrders,
        kmUsed: agent.kmUsed.toFixed(2),
        payout: Math.round(payout)
      };
    });

    res.status(200).json({
      message: 'Order allocation completed.',
      summary: payoutSummary
    });

  } catch (error) {
    console.error('Allocation Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
