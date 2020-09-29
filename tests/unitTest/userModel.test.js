const { User, validateUser } = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("Unit Test for userModel", () => {
  describe("userModel methods", () => {
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

      const decodedTestJwt = jwt.verify(
        testJwt,
        config.get("td_jwtPrivateKey")
      );
      expect(decodedTestJwt).toHaveProperty("_id");
    });
  });

  describe("userModel Joi validations", () => {
    test("should NOT return error if new user email and password is valid", () => {
      const testUserPayload = {
        email: "testuser@email.com",
        password: "testpassword",
      };
      const testValidate = validateUser(testUserPayload);

      expect(testValidate["error"]).toBeFalsy();
    });

    test("should return error if new user does not have a valid email", () => {
      const testUserPayload = {
        email: "testuser",
      };
      const testValidate = validateUser(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if password is less than 8 char", () => {
      const testUserPayload = {
        email: "testuser@email.com",
        password: "12",
      };
      const testValidate = validateUser(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if password not provided", () => {
      const testUserPayload = {
        email: "testuser@email.com",
      };
      const testValidate = validateUser(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });
  });
});
