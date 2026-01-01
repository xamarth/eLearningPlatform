import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

describe("Enrollment API", () => {
  let userToken;
  let courseId;

  beforeAll(async () => {
    const email = `user${Date.now()}@test.com`;

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "testStudent",
        email,
        password: "123456"
      });

    userToken = signup.body.token;

    const adminSignup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Admin",
        email: `admin${Date.now()}@test.com`,
        password: "123456"
      });

    await User.findByIdAndUpdate(adminSignup.body.user.id, { role: "admin" });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminSignup.body.user.email,
        password: "123456"
      });

    const course = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminLogin.body.token}`)
      .send({
        title: "Enroll Course",
        slug: `enroll-course-${Date.now()}`,
        description: "Enrollment test",
        difficulty: "beginner"
      });

    courseId = course.body._id;
  });

  it("should enroll user into course", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ courseId });

    expect(res.statusCode).toBe(201);
    expect(res.body.courseId).toBe(courseId);
  });
});
