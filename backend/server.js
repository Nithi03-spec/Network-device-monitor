console.log("SERVER FILE EXECUTED");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Device = require("./models/Device");
const Log = require("./models/Log");

const app = express();

// Middleware
app.use(cors({ origin: [ "http://network-monitor-frontend.s3-website.ap-south-1.amazonaws.com", // your frontend
    "http://localhost:3000"], methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));

// Routes
app.get("/", (req, res) => res.send("Backend running with MongoDB"));

// Get all devices
app.get("/devices", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

// Add new device
app.post("/devices", async (req, res) => {
  try {
    const { name, ip, type } = req.body;
    if (!name || !ip || !type) return res.status(400).json({ error: "All fields are required" });

    const device = new Device({ name, ip, type });
    await device.save();
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add device" });
  }
});

// Get last 50 logs
app.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(10);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Simulate device status updates every 5s
setInterval(async () => {
  try {
    const devices = await Device.find();
    for (let d of devices) {
      const newStatus = Math.random() > 0.5 ? "Online" : "Offline";
      d.status = newStatus;
      d.lastChecked = new Date();
      await d.save();

      const log = new Log({ deviceId: d._id, status: newStatus });
      await log.save();
    }
  } catch (err) {
    console.log("Skipping status update (DB not ready or error)", err.message);
  }
}, 5000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
