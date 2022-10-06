const mongoose = require("mongoose");

const TMTaskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  ownerName: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    maxlength: 30,
    minlength: 1,
    required: true,
  },
  description: {
    type: String,
    maxlength: 200,
    default: "",
  },
  status: {
    type: String,
    enum: ["Not Started", "Started", "Completed"],
    default: "Not Started",
    required: true,
  },
  assignedDate: {
    type: Date,
  },
  startedDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  notes: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "TMTaskNote",
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

TMTaskSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("TMTask", TMTaskSchema);
