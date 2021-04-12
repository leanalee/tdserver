const express = require("express");
const router = express.Router();
const { Task, validateTask } = require("../models/taskModel");
const authWithToken = require("../middleware/authWithToken");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

router.get("/:ownerId", async (req, res) => {
  const tasks = await Task.find({ ownerId: req.params.ownerId });
  res.send(tasks);
});

// router.get("/:id", async (req, res) => {
//   const task = await Task.findById(req.params.id);
//   if (!task) return res.status(404).send("Task was not found");
//   res.send(task);
// });

router.get("/:ownerId/:id", async (req, res) => {
  const task = await Task.find({
    ownerId: req.params.ownerId,
    _id: req.params.id,
  });
  if (!task) return res.status(404).send("Task was not found");
  res.send(task);
});

router.post("/", async (req, res) => {
  const validated = validateTask(req.body);
  if (validated.error) {
    return res.status(400).send(validated.error.message);
  }
  let task = new Task({
    ...req.body,
  });
  try {
    task = await task.save();
    res.send(task);
  } catch (ex) {
    return res.status(404).send(ex.message);
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
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

  res.send(task);
});

router.patch("/minsworked/:id", validateObjectId, async (req, res) => {
  console.log(req.body);
  const task = await Task.findByIdAndUpdate(req.params.id, {
    $set: {
      minsWorked: req.body["minsWorked"],
    },
  });
  if (!task) return res.status(404).send("Task not found");
  res.send(task);
});

router.patch("/done/:id", validateObjectId, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, {
    $set: {
      done: req.body["done"],
    },
  });
  if (!task) return res.status(404).send("Task not found");
  res.send(task);
});

router.delete("/:id", [validateObjectId, authWithToken], async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).send("Task was not found");
  }

  res.send(task);
});

module.exports = router;
