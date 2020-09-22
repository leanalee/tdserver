const winston = require("winston");
const debug = require("debug")("tdplaylist:dev");
const express = require("express");
const app = express();

require("./startup/startLogging")();
require("./startup/startConfig")();
require("./startup/startDB")();
require("./startup/startRoutes")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
debug("Debugging turned on...");
