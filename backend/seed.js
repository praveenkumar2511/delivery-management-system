// 

const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const { faker } = require('@faker-js/faker');

const Warehouse = require('./models/Warehouse');
const Agent = require('./models/Agent');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Clean up agents and orders only — keep warehouses
    await Agent.deleteMany();
    await Order.deleteMany();

    // Your existing warehouse IDs
    const warehouseIds = [
      "68516c5eb7e337e21b343b8e", // Chennai
      "68516c5eb7e337e21b343b91", // Mumbai
      "68516c5eb7e337e21b343b8f", // Coimbatore
      "68516c5eb7e337e21b343b90", // Bangalore
      "685273901634492ff517a1e8"  // Nilgiris
    ];

    // Fetch warehouse docs so we can use lat/lng
    const warehouses = await Warehouse.find({
      _id: { $in: warehouseIds }
    });

    // Create agents, assign to random warehouses
    const agents = [];
    for (let i = 0; i < 10; i++) {
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      const agent = await Agent.create({
        name: faker.person.fullName(),
        warehouseId: warehouse._id,
        currentSession: null,
        sessions: []
      });
      agents.push(agent);
    }

    // Create 50 orders, each assigned to a valid agent in same warehouse
    for (let i = 0; i < 50; i++) {
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      const agentCandidates = agents.filter(a => a.warehouseId.toString() === warehouse._id.toString());
      const agent = agentCandidates[Math.floor(Math.random() * agentCandidates.length)];

      await Order.create({
        warehouseId: warehouse._id,
        agentId: agent?._id || null,
        address: faker.location.streetAddress(),
        latitude: warehouse.latitude + Math.random() * 0.05,
        longitude: warehouse.longitude + Math.random() * 0.05,
        isDispatched: false,
        deliveryDate: faker.date.future(),
        status: "pending",
        receivedAt: null,
        deliveredAt: null
      });
    }

    console.log('🌱 Seed complete!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ DB Error:', err);
    process.exit(1);
  });
