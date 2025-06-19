const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: String,
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  checkInTime: Date,
  hoursWorked: Number,
  kmCovered: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
