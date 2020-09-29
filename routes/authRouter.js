const { User } = require("../models/userModel");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");

//generates authentication token for users who successfully login with
//valid username/email and password
//nothing is stored in db
//Should have POST /
//Should not have GET /
//Should not have PUT / or PATCH /
//SHOULD not have DELETE /

router.post("/", async (req, res) => {
  const validated = validateLogin(req.body);
  if (validated.error) return res.status(400).send(validated.error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  if (user.password) {
    const validPw = await bcrypt.compare(req.body.password, user.password);
    if (!validPw) return res.status(400).send("Invalid email or password");
  }

  const td_token = user.genAuthToken();

  res.send(td_token);
});

function validateLogin(req) {
  const loginSchema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8),
  });

  return loginSchema.validate(req);
}

module.exports = router;
