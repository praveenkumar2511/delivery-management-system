const cron = require("node-cron");
const { allocateOrders } = require("../services/allocationService");

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running order allocation job...");
  await allocateOrders();
});