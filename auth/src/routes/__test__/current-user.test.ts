import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const respContainingCookie = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = respContainingCookie.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
});
