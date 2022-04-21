import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@aatix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
