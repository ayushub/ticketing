export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "mock_fn_returned_id" }),
  },
};
