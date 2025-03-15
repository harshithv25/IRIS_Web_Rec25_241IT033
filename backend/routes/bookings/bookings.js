const express = require("express");
const Booking = require("../../models/Booking/Booking");
const router = express.Router();

// implement security gateway
// need to validate incoming data before commiting

// creates new booking
router.post("/", async (req, res) => {
  const { userId, bookableId, bookingId, bookableType, start_time, end_time } =
    req.body;

  try {
    const booking = new Booking({
      user: userId,
      bookable: bookableId,
      bookingId,
      bookableType,
      start_time,
      end_time,
      valid: null,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// cancel/update the booking all in one
router.put("/", async (req, res) => {
  const {
    user,
    bookableId,
    bookingId,
    bookableType,
    start_time,
    end_time,
    valid,
    cancelStatus,
    reason,
    expired,
  } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      user,
      bookableId,
      bookingId,
      bookableType,
      start_time,
      end_time,
      valid,
      cancelStatus,
      reason,
      expired,
    });
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
