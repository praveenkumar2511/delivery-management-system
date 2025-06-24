const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isDispatched: { type: Boolean, default: false },
    deliveryDate: { type: Date, required: true },
    
    status: {
      type: String,
      enum: ['pending', 'received', 'dispatched', 'delivered'],
      default: 'pending',
    },
    receivedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
