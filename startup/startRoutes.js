const express = require("express");
const tasks = require("../routes/tasksRouter");
const users = require("../routes/usersRouter");
const auth = require("../routes/authRouter");
const goals = require("../routes/goalsRouter");
const errorHandle = require("../middleware/errorHandle");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/tasks", tasks);
  app.use("/api/goals", goals);
  app.use(errorHandle);
};
