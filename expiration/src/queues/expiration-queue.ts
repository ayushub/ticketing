import Queue from "bull";

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
  console.log(
    "I want to publish an expiration:complete event for orderId",
    job.data.orderId
  );
});

export { expirationQueue };
