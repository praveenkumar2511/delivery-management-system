const mongoose = require('mongoose');
const warehouseSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number
},
{
      timestamps: true
});
module.exports = mongoose.model('Warehouse', warehouseSchema);