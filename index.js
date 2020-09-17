const express = require("express");
const { send } = require("process");
const app = express();
const debug = require("debug")("tdplaylist:dev");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/tdplaylist", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Could not connect to MongoDB..., error"));

const tasks = require("./routes/tasksRouter");
const users = require("./routes/usersRouter");

app.use(express.json());
app.use("/api/tasks", tasks);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
debug("Debugging turned on...");
