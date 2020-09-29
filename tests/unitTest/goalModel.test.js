const { Goal, validateGoal } = require("../../models/goalModel");

describe("goalModel unitTest", () => {
  describe("goalModel Joi validations", () => {
    test("should NOT return error if new goal is valid with name", () => {
      const testUserPayload = {
        name: "new goal",
      };
      const testValidate = validateGoal(testUserPayload);

      expect(testValidate["error"]).toBeFalsy();
    });

    test("should return error if new goal name is less than 3 char", () => {
      const testUserPayload = {
        name: "12",
      };
      const testValidate = validateGoal(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if new goal name is greater than 255 char", () => {
      const charLen256 = new Array(257).join("a");
      const testUserPayload = {
        name: charLen256,
      };
      const testValidate = validateGoal(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });
  });
});
