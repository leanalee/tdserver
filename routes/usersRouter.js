const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/userModel");

router.post("/", async (req, res) => {
  // const validated = validateUser(req.body);
  // console.log(validated);
  // if (validated.error) return res.status(400).send(validated.error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    ...req.body,
  });

  user = await user.save();
  console.log(user);
  res.send(user);
});

router.get("/", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.send(user);
});

module.exports = router;
