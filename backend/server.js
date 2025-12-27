console.log("SERVER FILE EXECUTED");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(cors({ origin: "*", methods: ["GET","POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err.message));

// Device Schema
const DeviceSchema = new mongoose.Schema({
  name: String,
  ip: String,
  type: String,
  status: String,
  lastChecked: Date
});
const Device = mongoose.model("Device", DeviceSchema);

// Device Log Schema
const LogSchema = new mongoose.Schema({
  deviceId: String,
  status: String,
  timestamp: Date
});
const Log = mongoose.model("Log", LogSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Backend running with MongoDB");
});

// Get all devices
app.get("/devices", async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
});

// Add new device
app.post("/devices", async (req, res) => {
  const device = new Device({
    name: req.body.name,
    ip: req.body.ip,
    type: req.body.type,
    status: "Offline",
    lastChecked: new Date()
  });
  await device.save();
  res.json(device);
});

// Get last 50 logs
app.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

// Simulate device status changes
setInterval(async () => {
  try {
    const devices = await Device.find();
    for (let d of devices) {
      d.status = Math.random() > 0.5 ? "Online" : "Offline";
      d.lastChecked = new Date();
      await d.save();

      // Save log
      const log = new Log({ deviceId: d._id, status: d.status, timestamp: d.lastChecked });
      await log.save();
    }
  } catch (err) {
    console.log("Skipping status update (DB not ready)");
  }
}, 5000);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});
