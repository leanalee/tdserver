if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  port: process.env.PORT,
  db: process.env.DB,
  td_pky: process.env.TD_PKY,
  db_test: process.env.DB_TEST,
};
