const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  status: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", LogSchema);
