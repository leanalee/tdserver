const { Task, validateTask } = require("../../models/taskModel");
const mongoose = require("mongoose");

describe("taskModel unitTest", () => {
  describe("taskModel Joi validations", () => {
    test("should NOT return error if new task is valid with title and ownerId", () => {
      const testUserPayload = {
        title: "new task1",
        ownerId: mongoose.Types.ObjectId().toHexString(),
      };
      const testValidate = validateTask(testUserPayload);

      expect(testValidate["error"]).toBeFalsy();
    });

    test("should return error if new task is does not have title", () => {
      const testUserPayload = {
        ownerId: mongoose.Types.ObjectId().toHexString(),
      };
      const testValidate = validateTask(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if new task title is less than 3 char", () => {
      const testUserPayload = {
        ownerId: mongoose.Types.ObjectId().toHexString(),
        title: "12",
      };
      const testValidate = validateTask(testUserPayload);
      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if new task title is more than than 255 char", () => {
      const charLen256 = new Array(257).join("a");
      const testUserPayload = {
        ownerId: mongoose.Types.ObjectId().toHexString(),
        title: charLen256,
      };
      const testValidate = validateTask(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });

    test("should return error if new task is does not have ownerId", () => {
      const testUserPayload = {
        title: "new task1",
      };
      const testValidate = validateTask(testUserPayload);

      expect(testValidate).toHaveProperty("error");
    });
  });

  describe("taskModel mongoose Schema validations", () => {
    test("should contain status set to new by default in new task", () => {
      const testTask = new Task();
      expect(testTask).toHaveProperty("status", "new");
    });
  });
});
