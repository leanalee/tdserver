const mongoose = require("mongoose");
const request = require("supertest");
const { Goal } = require("../../models/goalModel");
const { User } = require("../../models/userModel");

let server;

describe("/api/goals", () => {
  let testToken;
  let testName;

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Goal.remove({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /", () => {
    test("should return all goals from db", async () => {
      Goal.collection.insertMany([
        { name: "test goal number one" },
        { name: "test goal2" },
      ]);
      const res = await request(server).get("/api/goals");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((g) => g.name === "test goal number one")
      ).toBeTruthy();
      expect(res.body.some((g) => g.name === "test goal2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    test("should return goal when valid id is passed", async () => {
      let testGoal = new Goal({ name: "goal1" });
      await testGoal.save();
      const res = await request(server).get("/api/goals/" + testGoal._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "goal1");
    });

    test("should recieve 404 if invalid id", async () => {
      const badId = "12345678abcde";
      const res = await request(server).get("/api/goals/" + badId);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    //happy path for base testing.
    //change one parameter for unhappy paths that aligns with test goal

    beforeEach(() => {
      testToken = new User().genAuthToken();
      testName = "new years resolution";
    });

    const exec = async () => {
      return await request(server)
        .post("/api/goals")
        .set("td_auth_token", testToken)
        .send({ name: testName });
    };

    test("should return 401 if client is not logged in", async () => {
      testToken = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    test("should receive status 400 if token is null and enters catch block", async () => {
      testToken = null;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should receive status 400 if token is invalid and enters catch block", async () => {
      testToken = "testToken";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 if name is less than 3 characters", async () => {
      const bad_lt3name = new Array(1).join("a");
      testName = bad_lt3name;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 if name is more than 255 characters", async () => {
      const bad_gt255name = new Array(257).join("a");
      testName = bad_gt255name;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should receive status 200 if token is valid and goal is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name");
      expect(res.status).toBe(200);
    });

    test("should save goal in db if valid", async () => {
      await exec();
      const testGoal = await Goal.find({ name: testName });
      expect(testGoal).not.toBeNull();
      expect(testGoal[0]).toHaveProperty("_id");
      expect(testGoal[0]).toHaveProperty("name");
    });
  });

  describe("PUT /:id", () => {
    let testGoal;
    let testNameUpdated;
    let testGoalId;

    beforeEach(async () => {
      testToken = new User().genAuthToken();
      testName = "goal name for testing put method";

      testGoal = new Goal({ name: testName });
      await testGoal.save();
      testGoalId = testGoal._id;

      testNameUpdated = "update test goal name";
    });

    const exec = async () => {
      return await request(server)
        .put("/api/goals/" + testGoalId)
        .set("td_auth_token", testToken)
        .send({ name: testNameUpdated });
    };

    test("should return 200 if update a valid goal and goal should have updated name", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "update test goal name");
    });

    test("should return 404 from validateObjectId middleware", async () => {
      testGoalId = new Array(10).join("a");
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

    test("should return 404 from put method if goal id does not exist", async () => {
      testGoalId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.* not found/i);
    });
  });

  describe("DELETE /:id", () => {
    let testGoal;
    let testGoalId;

    beforeEach(async () => {
      testToken = new User().genAuthToken();
      testName = "goal name for testing delete method";
      testGoal = new Goal({
        name: testName,
      });
      await testGoal.save();

      testGoalId = testGoal._id;
    });

    const exec = () => {
      return request(server)
        .delete("/api/goals/" + testGoalId)
        .set("td_auth_token", testToken)
        .send();
    };
    test("should return 200 and delete the goal if valid goal id provided", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", testGoalId.toHexString());
      expect(res.body).toHaveProperty("name", testName);
    });

    test("should return 404 from validateObjectId middleware", async () => {
      testGoalId = new Array(10).join("a");
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

    test("should return 404 and if goal id does not exist", async () => {
      testGoalId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.*not found/);
    });
  });
});
