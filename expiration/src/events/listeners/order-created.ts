import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@aatix/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ): Promise<void> {
    // wait 15 mins
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: 10000,
      }
    );

    // publish order-expired event

    msg.ack();
  }
}
