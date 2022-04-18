import { Publisher, Subjects, TicketUpdatedEvent } from "@aatix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  onPublish(): void {
    console.log("Event published from ticket updated publisher");
  }
}
