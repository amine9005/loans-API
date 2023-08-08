const orderInput = {
  orderItems: ["llkdfg", "olfkkgn"],
  shippingAddress: "shippingAddress",
  paymentMethod: "payment",
  itemsPrice: [300, 150],
  shippingPrice: 50,
  totalPrice: 500,
};

const orderOutput = {
  _id: expect.any(String),
  orderItems: expect.any(Array<string>),
  shippingAddress: expect.any(String),
  paymentMethod: expect.any(String),
  itemsPrice: expect.any(Array<number>),
  shippingPrice: expect.any(Number),
  totalPrice: expect.any(Number),
};

export default { orderInput, orderOutput };
