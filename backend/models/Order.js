const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  address: String,
  latitude: Number,
  longitude: Number,
  isDispatched: { type: Boolean, default: false },
  deliveryDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
