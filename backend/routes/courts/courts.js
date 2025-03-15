const express = require("express");
const Court = require("../../models/Court/Court");
const router = express.Router();

// implement security gateway
// need to validate incoming data before commiting

router.post("/", async (req, res) => {
  const { name, location, media, capacity, operating_hours } = req.body;

  try {
    const court = new Court({
      name: name,
      location: location,
      media: media,
      capacity: capacity,
      operating_hours: operating_hours,
    });

    await court.save();
    res.status(201).json(court);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  const { name, location, media, capacity, operating_hours } = req.body;

  try {
    const court = await Court.findByIdAndUpdate(req.params.id, {
      name,
      location,
      media,
      capacity,
      operating_hours,
    });

    await court.save();
    res.status(200).json(court);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
