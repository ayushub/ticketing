import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@aatix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: { id: string; orderId: string; stripeId: string },
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Completed });
    await order.save();

    msg.ack();
  }
}
