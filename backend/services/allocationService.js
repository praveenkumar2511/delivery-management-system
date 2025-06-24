// services/allocationService.js

// Utility to calculate agent payout
const calculatePayout = (orders) => {
  if (orders >= 50) return orders * 42;
  if (orders >= 25) return orders * 35;
  return 500; // Minimum guarantee
};

// Main allocation logic
const allocateOrders = async (agents, orders) => {
  const ordersPerAgent = Math.floor(orders.length / agents.length);
  const assignments = [];

  let orderIndex = 0;

  for (let agent of agents) {
    const assignedOrders = orders.slice(orderIndex, orderIndex + ordersPerAgent);
    const payout = calculatePayout(assignedOrders.length);

    assignments.push({
      agentId: agent._id,
      orders: assignedOrders,
      payout,
    });

    orderIndex += ordersPerAgent;
  }

  // Remaining orders? Postpone to next day (or handle separately)
  const remainingOrders = orders.slice(orderIndex);

  return { assignments, remainingOrders };
};

module.exports = { allocateOrders };
