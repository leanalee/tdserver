const mongoose = require("mongoose");
const request = require("supertest");
const { Goal } = require("../../models/goalModel");
const { User } = require("../../models/userModel");

let server;

describe("/api/goals", () => {
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
        { label: "test goal number one" },
        { label: "test goal2" },
      ]);
      const res = await request(server).get("/api/goals");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((g) => g.label === "test goal number one")
      ).toBeTruthy();
      expect(res.body.some((g) => g.label === "test goal2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    test("should return goal when valid id is passed", async () => {
      let testGoal = new Goal({ label: "goal1" });
      await testGoal.save();
      const res = await request(server).get("/api/goals/" + testGoal._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("label", "goal1");
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

    let testToken;
    let testLabel;

    beforeEach(() => {
      testToken = new User().genAuthToken();
      testLabel = "new years resolution";
    });

    const exec = async () => {
      return await request(server)
        .post("/api/goals")
        .set("td_auth_token", testToken)
        .send({ label: testLabel });
    };

    test("should return 401 if client is not logged in", async () => {
      testToken = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    test("should return 400 if label is less than 3 characters", async () => {
      const bad_lt3Label = new Array(1).join("a");
      testLabel = bad_lt3Label;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should return 400 if label is more than 255 characters", async () => {
      const bad_gt255Label = new Array(257).join("a");
      testLabel = bad_gt255Label;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test("should save goal in db if valid", async () => {
      await exec();
      const testGoal = await Goal.find({ label: testLabel });
      expect(testGoal).not.toBeNull();
      expect(testGoal[0]).toHaveProperty("_id");
      expect(testGoal[0]).toHaveProperty("label");
    });
  });
});
