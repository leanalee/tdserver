require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let server;

//Should not have GET /
//Should not have PUT / or PATCH /
//SHOULD not have DELETE /

describe("api/auth", () => {
  let testpw;
  let testemail;

  beforeEach(() => {
    server = require("../../index");
    testpw = "testpassword";
    testemail = "testuser@email.com";
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  describe("POST /", () => {
    //exec contains happy path and valid variable populated in beforeEach
    //each unhappy path has an invalid parameter that aligns with test goals

    const exec = async () => {
      const spicing = await bcrypt.genSalt(10);
      const hashedpw = await bcrypt.hash("testpassword", spicing);

      const testUserPayload = {
        email: "testuser@email.com",
        password: hashedpw,
      };
      const testUser = new User(testUserPayload);
      await testUser.save();

      return await request(server)
        .post("/api/auth")
        .send({ email: testemail, password: testpw });
    };

    test("should return 200 for valid email and pw", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(jwt.verify(res.text, process.env.TD_PKY)).toHaveProperty("_id");
    });

    test("should return 400 for users with wrong pw", async () => {
      testpw = "wrongpw";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test("should return 400 for users with wrong email", async () => {
      testemail = "wrongemail@email.com";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    test("should return 400 for if email is invalid", async () => {
      testemail = "wrongemail";
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/^.*must be a valid email/);
    });

    test("should return 400 for if no password provided for user", async () => {
      testpw = "";
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/^.*not allowed to be empty/);
    });
  });
});
