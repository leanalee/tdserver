require("dotenv").config();
const mongoose = require("mongoose");

module.exports = function () {
  const db = (process.env.NODE_ENV = "test"
    ? process.env.DB_TEST
    : process.env.DB);
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => console.log(`Connected to ${db}...`))
    .catch((ex) => console.log("Could not connect to MongoDB...", ex));
};
