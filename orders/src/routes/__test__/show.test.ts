import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/orders/:orderId for get requests", async () => {
  const response = await request(app).get("/api/orders/123").send();
  expect(response.status).not.toEqual(404);
});

it("throws bad request on invalid order id", async () => {
  const response = await request(app)
    .get(`/api/orders/1234asdf`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);
});

it("throws not found on invalid order", async () => {
  const response = await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("throws not auth error if user does not own the order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 21,
  });
  await ticket.save();

  const user = global.signin();
  // make a request
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("fetches the order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 21,
  });
  await ticket.save();

  const user = global.signin();
  // make a request
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});
