const mongoose = require("mongoose");
const Joi = require("joi");

const Goal = mongoose.model(
  "Goal",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    dateCreated: { type: Date, default: Date.now() },
  })
);

function validateGoal(goal) {
  const goalSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
  });

  return goalSchema.validate(goal);
}

module.exports.Goal = Goal;
module.exports.validateGoal = validateGoal;
