const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
  name: String,
  category: String,
  media: String,
  quantity: Number,
  condition: String,
});

module.exports = mongoose.model("Equipment", EquipmentSchema);
