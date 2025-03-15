const mongoose = require("mongoose");

// ON hold

const WaitlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingType: { type: String, enum: ["Equipment", "Court"] },
  bookingId: { type: String, ref: "Booking" },
  bookingRef: String,
  inPosition: String,
});

module.exports = mongoose.model("Waitlist", WaitlistSchema);
