const mongoose = require("mongoose");

const TMUserTasksSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  tasks: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "TMTask",
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

TMUserTasksSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("TMUserTasks", TMUserTasksSchema);
