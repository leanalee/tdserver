const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 50, required: true },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 1024 },
});

userSchema.methods.genAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("td_jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

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
