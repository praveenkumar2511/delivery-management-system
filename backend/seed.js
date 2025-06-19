const mongoose = require('mongoose');
const dotenv = require('dotenv').config();;
const { faker } = require('@faker-js/faker');

const Warehouse = require('./models/Warehouse');
const Agent = require('./models/Agent');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Warehouse.deleteMany();
    await Agent.deleteMany();
    await Order.deleteMany();

    // Create 4 warehouses
    const warehouseNames = ['Chennai', 'Coimbatore', 'Bangalore', 'Mumbai'];
    const warehouses = await Promise.all(
      warehouseNames.map(name =>
        Warehouse.create({
          name: `Warehouse - ${name}`,
          latitude: 13.0 + Math.random(),
          longitude: 80.0 + Math.random()
        })
      )
    );

    // Create 10 agents, randomly assign to warehouses
    const agents = [];
    for (let i = 0; i < 10; i++) {
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      agents.push(await Agent.create({
name: faker.person.fullName(), // ✅ NEW
        warehouseId: warehouse._id,
        checkInTime: new Date(),
        hoursWorked: 0,
        kmCovered: 0
      }));
    }

    // Create 100 random orders
    for (let i = 0; i < 100; i++) {
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      await Order.create({
        warehouseId: warehouse._id,
        address: faker.address.streetAddress(),
        latitude: warehouse.latitude + Math.random() * 0.1,
        longitude: warehouse.longitude + Math.random() * 0.1,
        isDispatched: false,
        deliveryDate: new Date()
      });
    }

    console.log('✅ Seeding complete!');
    process.exit();
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
  });
