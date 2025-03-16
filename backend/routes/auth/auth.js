const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User/User");

const router = express.Router();

// implement security gateway
// need to validate incoming data before commiting

router.post("/register", async (req, res) => {
  const { name, email, branch, password, rollNumber } = req.body;

  // Encrypting the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      name,
      email,
      branch,
      password: hashedPassword,
      rollNumber,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      rollNumber: user.rollNumber,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  res.json({ token, user });
});

module.exports = router;
