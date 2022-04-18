import { Publisher, Subjects, TicketCreatedEvent } from "@aatix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  onPublish(): void {
    console.log("Event published from ticket created publisher");
  }
}
