const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, minlength: 3, maxlength: 50, required: true },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: { type: String, minlength: 8, maxlength: 1024 },
  })
);

function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255),
  });

  return userSchema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
