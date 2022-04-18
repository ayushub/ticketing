import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns 404 if a provided id doesnot exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdf",
      price: 123,
    })
    .expect(404);
});

it("returns a 401, if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdf",
      price: 123,
    })
    .expect(401);
});

it("returns 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "asdf",
      price: 123,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdf2",
      price: 125,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 123,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "asdf2",
      price: -5,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 125,
    })
    .expect(400);
});

it("returns a 200 and updates the ticket if all good", async () => {
  const cookie = global.signin();
  const title = "asdf2";
  const price = 125;
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "asdf",
      price: 123,
    });

  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.price).toEqual(price);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
