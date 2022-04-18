import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/orders for delete requests", async () => {
  const response = await request(app).delete("/api/orders/erwq").send();
  expect(response.status).not.toEqual(404);
});
