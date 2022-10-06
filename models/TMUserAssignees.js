const mongoose = require("mongoose");

const TMUserAssigneesSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  assignees: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedDate: {
    type: Date,
    default: () => Date.now(),
  },
});

TMUserAssigneesSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("TMUserAssignees", TMUserAssigneesSchema);
