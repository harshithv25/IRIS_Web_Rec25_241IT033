const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookable: { type: mongoose.Schema.Types.ObjectId, refPath: "bookableType" },
  bookingId: String,
  bookableType: { type: String, enum: ["Equipment", "Court"] },
  start_time: Date,
  end_time: Date,
  valid: Boolean || null,
  cancelStatus: Boolean || null,
  reason: String || null,
  expired: Boolean,
});

module.exports = mongoose.model("Booking", BookingSchema);
