const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  logDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

LogSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("Log", LogSchema);
