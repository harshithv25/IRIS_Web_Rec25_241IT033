const express = require("express");
const Equipment = require("../../models/Equipment/Equipment");
const router = express.Router();

// implement security gateway
// need to validate incoming data before commiting

router.post("/", async (req, res) => {
  const { name, category, media, quantity, condition } = req.body;

  try {
    const equipment = new Equipment({
      name,
      category,
      availability,
      quantity,
      condition,
    });

    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  const { name, category, media, quantity, condition } = req.body;

  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, {
      name,
      category,
      availability,
      quantity,
      condition,
    });

    await equipment.save();
    res.status(200).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
