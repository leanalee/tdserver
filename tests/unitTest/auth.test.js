const { User } = require("../../models/userModel");
const authWithToken = require("../../middleware/authWithToken");

describe("auth middleware unitTest", () => {
  test("should populate req.user with payload of valid jwt token", () => {
    const testToken = new User().genAuthToken();
    const req = { header: jest.fn().mockReturnValue(testToken) };
    const res = {};
    const next = jest.fn();
    authWithToken(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toHaveProperty("_id");
  });
});
