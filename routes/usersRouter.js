const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/userModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authWithToken = require("../middleware/authwithToken");

router.get("/me", authWithToken, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const validated = validateUser(req.body);
  if (validated.error) return res.status(400).send(validated.error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const spicing = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, spicing);

  user = await user.save();

  const td_token = user.genAuthToken();

  res.header("td_auth_token", td_token).send(_.pick(user, ["name", "email"]));
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
