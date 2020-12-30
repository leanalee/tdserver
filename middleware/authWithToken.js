const jwt = require("jsonwebtoken");
const { td_pky } = require("../config");

//authenticates a user for a URL path. prevents access if not authenticated.
function authWithToken(req, res, next) {
  const token = req.header("td_auth_token");
  if (!token) return res.status(401).send("Access Denied. Not logged in.");

  try {
    const decodedJwt = jwt.verify(token, td_pky);
    req.user = decodedJwt;
    next();
  } catch (ex) {
    res.status(400).send("Invalid authentication");
  }
}

module.exports = authWithToken;
