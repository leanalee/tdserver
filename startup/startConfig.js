const { td_pky } = require("../config");
module.exports = function () {
  if (!td_pky) {
    throw new Error("FATAL ERROR: TD_PKY is not defined");
  }
};
