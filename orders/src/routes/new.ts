import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@aatix/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { OrderStatus, Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      //check that the ID looks like a mongo db ID
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Valid ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket that user is trying to order iun the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // make sure that this ticket isnt already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // calc an expiration date of the order
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save to db
    const order = await Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();

    // publish an event for the created order
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
