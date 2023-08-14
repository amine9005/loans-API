const orderInput = {
  orderItems: ["llkdfg", "olfkkgn"],
  shippingAddress: "shippingAddress",
  paymentMethod: "payment",
  itemsPrice: [300, 150],
  shippingPrice: 50,
  totalPrice: 500,
};

const orderUpdate = {
  orderItems: ["233", "4df"],
  shippingAddress: "Address",
  paymentMethod: "payment2",
  itemsPrice: [350, 250],
  shippingPrice: 100,
  totalPrice: 750,
};

const orderOutput = {
  __v: expect.any(Number),
  _id: expect.any(String),
  orderItems: expect.any(Array<string>),
  shippingAddress: expect.any(String),
  paymentMethod: expect.any(String),
  itemsPrice: expect.any(Array<number>),
  shippingPrice: expect.any(Number),
  totalPrice: expect.any(Number),
};

export default { orderInput, orderOutput, orderUpdate };
