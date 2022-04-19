import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // save ticket to db
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secInstance = await Ticket.findById(ticket.id);

  // make 2 separate changes to the ticket
  firstInstance?.set({ price: 10 });
  secInstance?.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance?.save();

  // save the second fetched ticket --> this should fail
  try {
    await secInstance?.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point");
});
