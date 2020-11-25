const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Goal, validateGoal } = require("../models/goalModel");
const valObjId = require("../middleware/validateObjectId");
const authWithToken = require("../middleware/authWithToken");

//Should have GET /
//Should have GET /:id
//Should have POST /
//Should have PUT /:id or PATCH /:id
//SHOULD have DELETE /:id

router.get("/", async (req, res) => {
  const goals = await Goal.find();
  res.send(goals);
});

router.get("/:ownerId", async (req, res) => {
  const goals = await Goal.find({ ownerId: req.params.ownerId });
  res.send(goals);
});

router.get("/:id", valObjId, async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) return res.status(404).send("Goal was not found");
  res.send(goal);
});

router.get("/:ownerId/:id", valObjId, async (req, res) => {
  const goal = await Goal.find({
    ownerId: req.params.ownerId,
    _id: req.params.id,
  });
  if (!goal) return res.status(404).send("Goal was not found");
  res.send(goal);
});

router.post("/", authWithToken, async (req, res) => {
  const validated = validateGoal(req.body);
  if (validated.error) return res.status(400).send("Invalid input");

  let goal = new Goal({
    ...req.body,
  });

  goal = await goal.save();
  res.send(goal);
});

router.put("/:id", [valObjId, authWithToken], async (req, res) => {
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

router.delete("/:id", [valObjId, authWithToken], async (req, res) => {
  const goal = await Goal.findByIdAndRemove(req.params.id);
  if (!goal)
    return res.status(404).send("Goal was with given ID was not found");

  res.send(goal);
});

module.exports = router;
