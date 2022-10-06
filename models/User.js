const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    maxLength: 256,
    minLength: 6,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
    default: "images/00.jpg",
  },
  passwordHash: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
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

UserSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
