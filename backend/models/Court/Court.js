const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  name: String,
  location: String,
  media: String,
  capacity: Number,
  operating_hours: [Date],
});

module.exports = mongoose.model("Court", CourtSchema);
