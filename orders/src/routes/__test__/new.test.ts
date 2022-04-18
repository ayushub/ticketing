import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("throws error on invalid ticket", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: "1234",
    });
  expect(response.status).not.toEqual(404);
});
