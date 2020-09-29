const winston = require("winston");
const debug = require("debug")("tdplaylist:dev");
const express = require("express");
const app = express();
const cors = require("cors");

require("./startup/startLogging")();
app.use(cors());
require("./startup/startConfig")();
require("./startup/startDB")();
require("./startup/startRoutes")(app);

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
debug("Debugging turned on...");

module.exports = server;
