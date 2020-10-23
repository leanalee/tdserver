const { User } = require("../models/userModel");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const validated = validateLogin(req.body);
  if (validated.error) return res.status(400).send(validated.error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPw = await bcrypt.compare(req.body.password, user.password);
  if (!validPw) return res.status(400).send("Invalid email or password");

  const td_token = user.genAuthToken();

  res.send(td_token);
});

function validateLogin(req) {
  const loginSchema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required(),
  });

  return loginSchema.validate(req);
}

module.exports = router;
