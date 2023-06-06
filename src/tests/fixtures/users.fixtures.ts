const errorObject = expect.objectContaining({
  error: expect.any(String),
});

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
  authentication: {
    password: expect.any(String),
  },
};

export default { errorObject, userInput, userOutput, invalidUserInput };
