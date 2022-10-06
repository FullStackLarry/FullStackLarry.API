const mongoose = require("mongoose");

const TMTaskNoteSchema = new mongoose.Schema({
  task: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "TMTask",
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  note: {
    type: String,
    maxLength: 200,
    required: true,
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

TMTaskNoteSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("TMTaskNote", TMTaskNoteSchema);
