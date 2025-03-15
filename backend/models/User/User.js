const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  branch: String,
  password: String,
  rollNumber: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("User", UserSchema);
