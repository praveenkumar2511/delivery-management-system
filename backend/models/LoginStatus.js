const mongoose = require('mongoose');

const loginStatusSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('LoginStatus', loginStatusSchema);
