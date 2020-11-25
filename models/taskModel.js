const mongoose = require("mongoose");
const Joi = require("joi");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: { type: String, required: true, min: 3, max: 255 },
    ownerId: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      required: true,
    },

    dateCreated: {
      type: Date,
      default: Date.now(),
    },

    status: {
      type: String,
      enum: ["new", "inprogress", "completed", "onhold", "continuous"],
      default: "new",
      lowercase: true,
    },

    minsWorked: { type: {} },
    hrsNeeded: { type: Number, max: 255 },

    dueDate: { type: Date },
    scheduled: { type: Date },
    goal: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Goal",
    },
    //tags: {type: String, maxlength: 255, minlength:1}
    //can select multiple tasks and update label
    //notes: {type: String, maxlength: 255},
    //links: { type: String },
  })
);

function validateTask(task) {
  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    ownerId: Joi.string().required(),
    status: Joi.string(),
    links: Joi.string(),
    dueDate: Joi.date().allow(""),
    minsWorked: Joi.object().optional(),
    hrsNeeded: Joi.number(),
    scheduled: Joi.date().allow(""),
    goal: Joi.string().allow(""),
    label: Joi.array(), //can select multiple tasks and update label
  });

  return taskSchema.validate(task);
}

exports.Task = Task;
exports.validateTask = validateTask;
