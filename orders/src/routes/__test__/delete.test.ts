import { OrderStatus } from "@aatix/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for delete requests", async () => {
  const response = await request(app).delete("/api/orders/erwq").send();
  expect(response.status).not.toEqual(404);
});

it("throws bad request on invalid order id", async () => {
  const response = await request(app)
    .delete(`/api/orders/1234asdf`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);
});

it("throws not found on invalid order", async () => {
  const response = await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("throws not auth error if user does not own the order", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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

  // make a request to delete the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("marks order as cancelled", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 21,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 21,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
