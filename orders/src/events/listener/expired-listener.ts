import { ExpiredEvent, Listener, Subjects } from "@aatix/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class ExpiredListener extends Listener<ExpiredEvent> {
  subject: Subjects.Expired = Subjects.Expired;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    order.save();

    msg.ack();
  }
}
