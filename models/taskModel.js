const mongoose = require("mongoose");
const Joi = require("joi");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: { type: String, required: true, min: 3, max: 255 },
    status: {
      type: String,
      required: true,
      enum: ["new", "inprogress", "completed", "onhold", "continuous"],
      lowercase: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    links: { type: String },
    dueDate: { type: Date },
    hrsWorked: { type: Number, max: 255 },
    hrsNeeded: { type: Number, max: 255 },
    scheduled: { type: Date },
    label: { type: [String] }, //can select multiple tasks and update label
    parentTask: { type: String }, //id and name of parent task
    // notes: {type: String, maxlength: 255},
    //music: link to music
  })
);

function validateTask(task) {
  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    status: Joi.string().required(),
    ownerId: Joi.string().required(),
    links: Joi.string(),
    dueDate: Joi.date(),
    hrsWorked: Joi.number(),
    hrsNeeded: Joi.number(),
    scheduled: Joi.date(),
    label: Joi.array(), //can select multiple tasks and update label
    parentTask: Joi.string(), //id and name of parent task
  });

  return taskSchema.validate(task);
}

exports.Task = Task;
exports.validateTask = validateTask;
