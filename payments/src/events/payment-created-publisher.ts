import { PaymentCreatedEvent, Publisher, Subjects } from "@aatix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  onPublish(): void {
    console.log("Event published from payments service");
  }
}
