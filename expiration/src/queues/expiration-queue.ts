import Queue from "bull";
import { ExpiredPublisher } from "../events/expired-publisher";
import { natsWrapper } from "../nats-wrapper";

if (!process.env.REDIS_HOST) throw new Error("REDIS_HOST must be defined");

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // publish order-expired event
  await new ExpiredPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
