require("dotenv").config();
module.exports = function () {
  if (!process.env.TD_PKY) {
    throw new Error("FATAL ERROR: TD_PKY is not defined");
  }
};
