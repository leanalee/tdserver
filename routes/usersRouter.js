const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/userModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const authWithToken = require("../middleware/authWithToken");

//Should have POST /
//Should have GET /
//Should have GET /me
//Should have PUT / or PATCH /
//SHOULD have DELETE /

router.get("/me", authWithToken, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("User not found");

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

  res
    .header("td_auth_token", td_token)
    .header("access-control-expose-headers", "td_auth_token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
