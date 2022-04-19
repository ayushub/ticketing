import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("throws Bad Request error on invalid ticket", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: "1234",
    });
  expect(response.status).toEqual(400);
});

it("throws Not Found error if ticket doenot exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = global.signin();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(404);
});

it("throws error if ticket already reserved", async () => {
  const ticket = Ticket.build({
    id: "1234",
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const existingOrder = Order.build({
    ticket,
    userId: "testse",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await existingOrder.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: "1234",
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const orders = await Order.find();
  const numberOfOrders = orders.length;

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const ordersPost = await Order.find();
  const numberOfOrdersPost = ordersPost.length;

  expect(numberOfOrdersPost - numberOfOrders).toEqual(1);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: "1234",
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
