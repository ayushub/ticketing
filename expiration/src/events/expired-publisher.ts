import { ExpiredEvent, Publisher, Subjects } from "@aatix/common";

export class ExpiredPublisher extends Publisher<ExpiredEvent> {
  subject: Subjects.Expired = Subjects.Expired;
  onPublish(): void {
    console.log("Event published from Expiration service");
  }
}
