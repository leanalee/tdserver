const mongoose = require("mongoose");
const Joi = require("joi");

const Goal = mongoose.model(
  "Goal",
  new mongoose.Schema({
    label: { type: String, required: true, minlength: 3, maxlength: 255 },
    taskList: { type: [mongoose.Types.ObjectId] },
  })
);

function validateGoal(goal) {
  const goalSchema = Joi.object({
    label: Joi.string().min(3).max(255).required(),
    taskList: Joi.array().items(Joi.string()),
  });

  return goalSchema.validate(goal);
}

module.exports.Goal = Goal;
module.exports.validateGoal = validateGoal;
