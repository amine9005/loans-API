import { Int32 } from "mongodb";

const errorObject = {
  error: expect.any(String),
};

const productInput = {
  name: "Phone",
  thumbnail: "filepath",
  pictures: ["filepath1", "filepath2"],
  slag: "slag-phone",
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
};

const productOutput = {
  _id: expect.any(String),
  name: expect.any(String),
  thumbnail: expect.any(String),
  slag: expect.any(String),
  pictures: expect.any(Array<string>),
  price: expect.any(Number),
  quantity: expect.any(Number),
};

export default { errorObject, productInput, productOutput, productUpdated };
