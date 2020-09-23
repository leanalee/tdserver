const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Goal, validateGoal } = require("../models/goalModel");
const valObjId = require("../middleware/validateObjectId");
const authWithToken = require("../middleware/authWithToken");

router.get("/", async (req, res) => {
  const goals = await Goal.find();
  res.send(goals);
});

router.get("/:id", valObjId, async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) return res.status(404).send("Goal was not found");
  res.send(goal);
});

router.post("/", authWithToken, async (req, res) => {
  const validated = validateGoal(req.body);
  if (validated.error) return res.status(400).send("Invalid input");

  let goal = new Goal({
    ...req.body,
  });

  const result = await goal.save();
  res.send(result);
});

module.exports = router;
