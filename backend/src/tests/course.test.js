import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.js";

describe("Courses API", () => {
  let adminToken;

  beforeAll(async () => {
    const email = `admin${Date.now()}@test.com`;

    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "testadmin",
        email,
        password: "123456"
      });

    const userId = signupRes.body.user.id;

    await User.findByIdAndUpdate(userId, { role: "admin" });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "123456"
      });

    adminToken = loginRes.body.token;
  });

  it("should allow admin to create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Course",
        slug: `test-course-${Date.now()}`,
        description: "Test description",
        difficulty: "beginner"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Course");
  });
});
