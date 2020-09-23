const express = require("express");
const router = express.Router();
const { Task, validateTask } = require("../models/taskModel");
const authWithToken = require("../middleware/authWithToken");

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("Task was not found");
  res.send(task);
});

router.post("/", authWithToken, async (req, res) => {
  const validated = validateTask(req.body);
  if (validated.error) {
    return res.status(400).send(validated.error.message);
  }

  const task = new Task({
    ...req.body,
  });
  try {
    const result = await task.save();
    return res.send(result);
  } catch (ex) {
    return res.status(404).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  const validated = validateTask(req.body);
  if (validated.error) {
    return res.status(400).send(validated.error);
  }
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  );

  if (!task) return res.status(404).send("Task not found");

  return res.send(task);
});

router.delete("/:id", async (req, res) => {
  const task = await findbyIdandDelete(req.params.id);
  if (!task) {
    return res.status(404).send("Task was not found");
  }

  return res.send(task);
});

module.exports = router;
