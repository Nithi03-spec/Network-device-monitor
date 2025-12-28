const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: "Offline" },
  lastChecked: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Device", DeviceSchema);
