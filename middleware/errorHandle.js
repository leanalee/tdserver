const winston = require("winston");

module.exports = function error(err, req, res, next) {
  winston.error(err.message, err);
  //Log Exception
  res.status(500).send("Unidentified Server Error");
};
