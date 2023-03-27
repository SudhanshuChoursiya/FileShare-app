const mongoose = require("mongoose");
const moment = require("moment");

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  filesize: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    default: () => moment().add(23, "hours").toDate(),
  },
});

module.exports = mongoose.model("upload", uploadSchema);
