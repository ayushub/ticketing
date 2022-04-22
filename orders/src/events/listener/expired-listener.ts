import { ExpiredEvent, Listener, Subjects } from "@aatix/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers";
import { queueGroupName } from "./queue-group-name";

export class ExpiredListener extends Listener<ExpiredEvent> {
  subject: Subjects.Expired = Subjects.Expired;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order not found");
    if (order.status === OrderStatus.Completed) return msg.ack();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
