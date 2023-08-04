const errorObject = {
  error: expect.any(String),
};

const productInput = {
  name: "Phone",
  thumbnail: "filepath",
  pictures: ["filepath1", "filepath2"],
  slag: "slag-phone",
  short_description: "phone short description",
  description: "phone description",
  featured: false,
  price: 400,
  quantity: 20,
};

const productUpdated = {
  name: "Phone2",
  thumbnail: "filepath2",
  pictures: ["filepath3", "filepath4"],
  slag: "slag-phone2",
  price: 450,
  quantity: 25,
  short_description: "phone short description 2",
  description: "phone description 2",
  featured: true,
};

const productOutput = {
  _id: expect.any(String),
  name: expect.any(String),
  thumbnail: expect.any(String),
  slag: expect.any(String),
  pictures: expect.any(Array<string>),
  short_description: expect.any(String),
  description: expect.any(String),
  featured: expect.any(Boolean),
  price: expect.any(Number),
  quantity: expect.any(Number),
};

export default { errorObject, productInput, productOutput, productUpdated };
