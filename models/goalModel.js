const mongoose = require("mongoose");
const Joi = require("joi");

const Goal = mongoose.model(
  "Goal",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    ownerId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
    },
    status: {
      type: String,
      enum: ["new", "inprogress", "completed", "onhold", "continuous"],
      default: "new",
      lowercase: true,
    },
    dueDate: { type: Date },
    dateCreated: { type: Date, default: Date.now() },
  })
);

function validateGoal(goal) {
  const goalSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    ownerId: Joi.string(),
    status: Joi.string(),
    dueDate: Joi.date(),
    dateCreated: Joi.date(),
  });

  return goalSchema.validate(goal);
}

module.exports.Goal = Goal;
module.exports.validateGoal = validateGoal;
