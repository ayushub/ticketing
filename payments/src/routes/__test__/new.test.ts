import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

it("throw not found if order id doesnot exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "testssd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("throws unauthorsied when user doesnot own the order", async () => {
  const order = Order.build({
    userId: "1234",
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "testssd",
      orderId: order.id,
    })
    .expect(401);
});

it("throws a bad request error, when order is cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId: userId,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "testssd",
      orderId: order.id,
    })
    .expect(400);
});

it("creates a payment", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId: userId,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.amount).toEqual(1000);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: "mock_fn_returned_id",
  });

  expect(payment).not.toBeNull();
});
