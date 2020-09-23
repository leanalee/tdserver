const { User, validateUser } = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("Generate token for the user", () => {
  test("should generate a valid jwt token", () => {
    const testUserPayload = {
      name: "Test User",
      email: "testuser@email.com",
      password: "testpassword",
    };
    const testUser = new User(testUserPayload);
    const testJwt = testUser.genAuthToken();

    expect(testJwt).toBe(
      jwt.sign({ _id: testUser._id }, config.get("td_jwtPrivateKey"))
    );

    const decodedTestJwt = jwt.verify(testJwt, config.get("td_jwtPrivateKey"));
    expect(decodedTestJwt).toHaveProperty("_id");
  });
});
