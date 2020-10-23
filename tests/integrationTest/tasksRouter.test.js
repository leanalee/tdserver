const { before } = require("lodash");
const mongoose = require("mongoose");
const request = require("supertest");
const { Task } = require("../../models/taskModel");
const { User } = require("../../models/userModel");

describe("/api/tasks", () => {
  let testUser;
  let testToken;
  let testTitle;

  beforeEach(() => {
    server = require("../../index");
    testUser = mongoose.Types.ObjectId();
    testToken = new User().genAuthToken();
    testTitle = "new task --test tasks router";
  });
  afterEach(async () => {
    await server.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /", () => {
    test("should return all tasks from db", async () => {
      Task.collection.insertMany([
        { title: "test task number one", ownerId: testUser },
        { title: "test task2", ownerId: testUser },
      ]);
      const res = await request(server).get("/api/tasks");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((g) => g.title === "test task number one")
      ).toBeTruthy();
      expect(res.body.some((g) => g.title === "test task2")).toBeTruthy();
      expect(
        res.body.some((g) => g.ownerId === testUser.toHexString())
      ).toBeTruthy();
    });
  });

  describe("GET /id", () => {
    beforeEach(async () => {
      testTask = new Task({ title: testTitle, ownerId: testUser });
      await testTask.save();
      testTaskId = testTask._id;
    });

    afterEach(async () => {
      await Task.remove({});
    });

    test("should return 200 if task id is valid", async () => {
      const res = await request(server).get("/api/tasks/" + testTaskId);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", testTitle);
    });

    test("should return 404 if task is not found", async () => {
      let testTaskId = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/tasks/" + testTaskId);

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.*not found/);
    });
  });

  describe("POST /", () => {
    afterEach(async () => {
      await Task.remove({});
    });

    const exec = () => {
      return request(server)
        .post("/api/tasks/")
        .set("td_auth_token", testToken)
        .send({ title: testTitle, ownerId: testUser });
    };
    test("should return 200 and if valid parameters for task provided", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", testTitle);
      expect(res.body).toHaveProperty("ownerId", testUser.toHexString());
    });

    test("should return 400 if title is less than 3 characters", async () => {
      const bad_lt3Title = new Array(1).join("a");
      testTitle = bad_lt3Title;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 if label is more than 255 characters", async () => {
      const bad_gt255Title = new Array(257).join("a");
      testTitle = bad_gt255Title;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 owner id is null", async () => {
      testUser = null;

      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    let testTask;
    let testTaskId;
    let testTitleUpdate;
    let testHrsNeeded;

    beforeEach(async () => {
      testTask = new Task({ title: testTitle, ownerId: testUser });
      await testTask.save();
      testTaskId = testTask._id;
      testTitleUpdate =
        "updated existing test task --test tasks router put method ";
    });

    afterEach(async () => {
      await Task.remove({});
    });

    const exec = async () => {
      return await request(server)
        .put("/api/tasks/" + testTaskId)
        .set("td_auth_token", testToken)
        .send({
          title: testTitleUpdate,
          ownerId: testUser,
          hrsNeeded: testHrsNeeded,
        });
    };

    test("should return 200 if update a valid task and task should have updated title", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", testTitleUpdate);
      expect(res.body).toHaveProperty("hrsNeeded", testHrsNeeded);
    });

    test("should return 404 from validateObjectId middleware for invalid task id", async () => {
      testTaskId = new Array(10).join("a");
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Invalid objectId/);
    });

    test("should return 404 from put method if task id does not exist", async () => {
      testTaskId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.*not found/i);
    });

    test("should return 400 if invalid update parameters", async () => {
      testHrsNeeded = "string 5";
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    afterEach(async () => {
      await Task.remove({});
    });

    const exec = () => {
      return request(server)
        .post("/api/tasks/")
        .set("td_auth_token", testToken)
        .send({ title: testTitle, ownerId: testUser });
    };
    test("should return 200 and if valid parameters for task provided", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", testTitle);
      expect(res.body).toHaveProperty("ownerId", testUser.toHexString());
    });

    test("should return 400 if title is less than 3 characters", async () => {
      const bad_lt3Title = new Array(1).join("a");
      testTitle = bad_lt3Title;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 if label is more than 255 characters", async () => {
      const bad_gt255Title = new Array(257).join("a");
      testTitle = bad_gt255Title;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 owner id is null", async () => {
      testUser = null;

      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /:id", () => {
    let testTask;
    let testTaskId;

    beforeEach(async () => {
      testTask = new Task({ title: testTitle, ownerId: testUser });
      await testTask.save();
      testTaskId = testTask._id;
    });

    afterEach(async () => {
      await Task.remove({});
    });

    const exec = async () => {
      return await request(server)
        .delete("/api/tasks/" + testTaskId)
        .set("td_auth_token", testToken)
        .send();
    };

    test("should return 200 user is authenticated and task id is valid and exists in db", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", testTaskId.toHexString());
      expect(res.body).toHaveProperty("title", testTitle);
    });

    test("should return 404 from validateObjectId middleware for invalid task id", async () => {
      testTaskId = new Array(10).join("a");
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Invalid objectId/);
    });

    test("should return 401 from authWithToken middleware if no valid token", async () => {
      testToken = "";
      const res = await exec();

      expect(res.status).toBe(401);
      expect(res.text).toMatch(/^.*not logged in/i);
    });

    test("should return 404 from put method if task id does not exist", async () => {
      testTaskId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.*not found/i);
    });
  });
});
