import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@aatix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ): void {
    // wait 15 mins

    // publish order-expired event

    msg.ack();
  }
}
