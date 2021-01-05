const express = require("express");
const router = express.Router();
const { Goal, validateGoal } = require("../models/goalModel");
const authWithToken = require("../middleware/authWithToken");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const goals = await Goal.find();
  res.send(goals);
});

router.get("/:ownerId", async (req, res) => {
  const goals = await Goal.find({ ownerId: req.params.ownerId });
  res.send(goals);
});

router.get("/:ownerId/:id", async (req, res) => {
  const goal = await Goal.find({
    ownerId: req.params.ownerId,
    _id: req.params.id,
  });
  if (!goal) return res.status(404).send("Goal was not found");
  res.send(goal);
});

router.post("/", async (req, res) => {
  const validated = validateGoal(req.body);
  if (validated.error) return res.status(400).send("Invalid input");

  let goal = new Goal({
    ...req.body,
  });

  goal = await goal.save();
  res.send(goal);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const validated = validateGoal(req.body);
  if (validated.error) {
    return res.status(400).send(validated.error);
  }

  const goal = await Goal.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  );

  if (!goal) return res.status(404).send("Task not found");

  res.send(goal);
});

router.delete("/:id", [validateObjectId, authWithToken], async (req, res) => {
  const goal = await Goal.findByIdAndRemove(req.params.id);
  if (!goal)
    return res.status(404).send("Goal was with given ID was not found");

  res.send(goal);
});

module.exports = router;
