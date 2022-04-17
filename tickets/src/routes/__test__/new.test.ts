import { RequestValidationError } from "@aatix/common";
import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed iuf the user is signed in", async () => {
  return request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
  // add in a check to see if it was the request validation error
});

it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: -1,
    });

  expect(response.status).toEqual(400);
});

it("create a ticket with valid inputs", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 10,
    });

  expect(response.status).toEqual(201);
});
