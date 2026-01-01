import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  let token;
  let email = `test${Date.now()}@test.com`;
  let password = "123456";

  it("should signup a user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "testUser",
        email,
        password
      });

    token = res.body.token;
    expect(token).toBeDefined();
  });

  it("should access protected /me route", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(email);
  });
});
