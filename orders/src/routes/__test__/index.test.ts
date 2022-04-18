import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

const createOrder = async (user: string[], ticketId: any) => {
  return await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId })
    .expect(201);
};

it("has a route handler listening to /api/orders for get requests", async () => {
  const response = await request(app).get("/api/orders").send();

  expect(response.status).not.toEqual(404);
});

it("fetches orders for a particular user", async () => {
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await createOrder(user1, t1.id);
  const { body: order2 } = await createOrder(user2, t2.id);
  const { body: order3 } = await createOrder(user2, t3.id);

  let orders = await request(app)
    .get("/api/orders")
    .set("Cookie", user1)
    .expect(200);

  expect(orders.body[0].id).toEqual(order1.id);

  orders = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(orders.body[0].id).toEqual(order2.id);
  expect(orders.body[1].id).toEqual(order3.id);
});
