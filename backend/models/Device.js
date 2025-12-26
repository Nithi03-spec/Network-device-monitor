const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: String,
  ip: String,
  type: String,
  status: String,
  lastChecked: Date,
});

module.exports = mongoose.model("Device", DeviceSchema);
