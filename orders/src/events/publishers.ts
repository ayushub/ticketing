import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@aatix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  onPublish(): void {
    console.log("Event published from order created publisher");
  }
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  onPublish(): void {
    console.log("Event published from order cancelled publisher");
  }
}
