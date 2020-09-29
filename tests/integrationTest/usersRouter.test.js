const { before } = require("lodash");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/userModel");

describe("/api/users", () => {
  let testToken;
  let testUserPayload;

  beforeEach(() => {
    server = require("../../index");
    testUserPayload = {
      name: "test user",
      email: "testuser@email.com",
      password: "testpassword",
    };
  });
  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  afterAll(async () => {
    //await User.remove({});
    await mongoose.disconnect();
  });

  //Unhappy => when password is invalid --too short
  describe("POST /", () => {
    test("should return 200 if valid user registration", async () => {
      const res = await request(server)
        .post("/api/users")
        .send(testUserPayload);
      expect(res.status).toBe(200);
    });

    test("should return 400 if email is already registered", async () => {
      await request(server).post("/api/users").send(testUserPayload);

      const res = await request(server)
        .post("/api/users")
        .send(testUserPayload);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/^.*already registered/);
    });

    test("should return 400 if invalid user email", async () => {
      testUserPayload.email = "testemail";

      const res = await request(server)
        .post("/api/users")
        .send(testUserPayload);
      expect(res.status).toBe(400);
    });

    test("should return 400 if no user password provided", async () => {
      delete testUserPayload.password;

      const res = await request(server)
        .post("/api/users")
        .send(testUserPayload);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /me", () => {
    let testUser;
    let testUserId;
    beforeEach(async () => {
      testUser = new User(testUserPayload);
      testUserId = testUser._id;
      testToken = testUser.genAuthToken();
      await testUser.save();
    });
    test("should return 200 if valid user is querying", async () => {
      const res = await request(server)
        .get("/api/users/me")
        .set("td_auth_token", testToken);

      expect(res.status).toBe(200);
    });

    test("should return 404 if token without an existing user in db", async () => {
      testToken = new User().genAuthToken();
      const res = await request(server)
        .get("/api/users/me")
        .set("td_auth_token", testToken);

      expect(res.status).toBe(404);
      expect(res.text).toMatch(/^.*not found/);
    });

    test("should return 401 if invalid authentication token provided", async () => {
      testToken = "";
      const res = await request(server)
        .get("/api/users/me")
        .set("td_auth_token", testToken);

      expect(res.status).toBe(401);
      expect(res.text).toMatch(/^.*Not logged in/);
    });
  });
});
