const { db, db_test } = require("../config");
const mongoose = require("mongoose");

module.exports = function () {
  const db_use = process.env.NODE_ENV === "test" ? db_test : db;
  mongoose
    .connect(db_use, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => console.log(`Connected to ${db_use}...`))
    .catch((ex) => console.log("Could not connect to MongoDB...", ex));
};
