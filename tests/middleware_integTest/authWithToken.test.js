const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/userModel");
const { Goal } = require("../../models/goalModel");
let server;

describe("auth middlware", () => {
  //exec contains happy path and valid variable populated in beforeEach
  //each unhappy path has an invalid parameter that aligns with test goals
  let testToken;
  let testGoal;

  beforeEach(() => {
    server = require("../../index");
    testToken = new User().genAuthToken();
    testGoal = "valid goal label";
  });

  afterEach(async () => {
    await server.close();
    await Goal.remove({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const exec = async () => {
    return await request(server)
      .post("/api/goals")
      .set("td_auth_token", testToken)
      .send({ label: testGoal });
  };

  test("should receive status 401 if no token is provided", async () => {
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

  test("should receive status 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
