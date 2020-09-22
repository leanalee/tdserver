const express = require("express");
const router = express.Router();
const { Goal, validateGoal } = require("../models/goalModel");

router.get("/", async (req, res) => {
  throw new Error("could not get the goals");
  const goals = await Goal.find();
  res.send(goals);
});

router.post("/", async (req, res) => {
  const validated = validateGoal(req.body);
  if (validated.error) return res.status(404).send("Invalid input");

  let goal = new Goal({
    ...req.body,
  });

  const result = await goal.save();
  res.send(result);
});

module.exports = router;
