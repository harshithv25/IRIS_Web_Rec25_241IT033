require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// THE ROUTES FOR THE APPLICATION
const authRoutes = require("./routes/auth/auth");
const bookingRoutes = require("./routes/bookings/bookings");
const courtsRoutes = require("./routes/courts/courts");
const equipmentsRoutes = require("./routes/equipments/equipments");

// API ENDPOINTS FOR THE FRONTEND
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/equipments", equipmentsRoutes);

app.get("/", (req, res) => {
  res.send(
    "Hello! this is the backend for the sport infrastrucutre module of IRIS!"
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
