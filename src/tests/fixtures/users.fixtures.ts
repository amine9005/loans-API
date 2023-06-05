const errorObject = expect.objectContaining({
  error: expect.any(String),
});

const userInput = {
  firstName: "Amine",
  middleName: "S",
  lastName: "Selmi",
  email: "user is user",
  dob: new Date(),
  authentication: { password: "12550" },
};

const invalidUserInput = {
  //   firstName: "Amine",
  middleName: "S",
  lastName: "Selmi",
  email: "user is user",
  dob: new Date(),
  authentication: { password: "12550" },
};

const userOutPut = expect.objectContaining({
  firstName: expect.any(String),
  //   middleName: expect.any(String),
  lastName: expect.any(String),
  email: expect.any(String),
  dob: expect.any(Date),
  authentication: { password: expect.any(String) },
  _id: expect.any(String),
});

export default { errorObject, userInput, userOutPut, invalidUserInput };
