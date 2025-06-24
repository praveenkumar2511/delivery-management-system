// const mongoose = require('mongoose');

// const agentSchema = new mongoose.Schema({
//   name: String,
//   warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
//   checkInTime: Date,
//   hoursWorked: Number,
//   kmCovered: Number
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Agent', agentSchema);


const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: String, // YYYY-MM-DD
  checkInTime: Date,
  checkOutTime: Date,
  hoursWorked: Number,
  kmCovered: Number,
  ordersCompleted: { type: Number, default: 0 },
});

const agentSchema = new mongoose.Schema({
  name: String,
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  isCheckedIn: { type: Boolean, default: false }, // ✅ NEW FIELD
  currentSession: {
    checkInTime: Date,
  },
  sessions: [sessionSchema],
    loginHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoginStatus' }] 
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
