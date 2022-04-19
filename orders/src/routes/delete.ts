import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@aatix/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { OrderCancelledPublisher } from "../events/publishers";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      throw new BadRequestError("Invalid order Id");

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
