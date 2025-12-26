console.log("SERVER FILE EXECUTED");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Device = require("./models/Device");

const app = express();

const corsOptions = {
  origin: "*", // allow all origins for now
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err.message));

// Test route
app.get("/", (req, res) => {
  res.send("Backend running with MongoDB");
});

// Get all devices
app.get("/devices", async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
});

// Add device
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

// Simulate device status change
setInterval(async () => {
  try {
    const devices = await Device.find();
    for (let d of devices) {
      d.status = Math.random() > 0.5 ? "Online" : "Offline";
      d.lastChecked = new Date();
      await d.save();
    }
  } catch (err) {
    console.log("Skipping status update (DB not ready)");
  }
}, 5000);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});