const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/tdplaylist", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((ex) => console.log("Could not connect to MongoDB...", ex));
};
