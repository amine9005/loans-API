const errorObject = expect.objectContaining({
  error: expect.any(String),
});

// import {IUserDoc} from '../../models/user.model'

function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function createRandomUser() {
  return {
    firstName: makeId(10),
    middleName: makeId(10),
    lastName: makeId(10),
    email: makeId(10),
    dob: new Date(),
    password: makeId(10),
  };
}

const userInput = {
  firstName: "Amine",
  middleName: "S",
  lastName: "Selmi",
  email: "user_user",
  dob: new Date(),
  password: "12550",
};

const invalidUserInput = {
  //   firstName: "Amine",
  middleName: "S",
  lastName: "Selmi",
  email: "user_user",
  dob: new Date(),
  password: "12550",
};

const userOutput = {
  _id: expect.any(String),
  firstName: expect.any(String),
  lastName: expect.any(String),
  dob: expect.any(String),
};

export default {
  errorObject,
  createRandomUser,
  userInput,
  userOutput,
  invalidUserInput,
};
