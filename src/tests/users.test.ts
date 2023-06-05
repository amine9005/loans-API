import app from "../app";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";
import usersController from "../controllers/users.controller";

const api = config.api.url + "/users";

//each test block must handle errors

//each test should have return code (200,404,403,500,...)
//each test should return a json object
//each test should return a defined body object with it's definition

const errorObject = expect.objectContaining({
  error: expect.any(String),
});

describe("Registration", () => {
  // user registration
  // test("should create a user", async () => {
  //   const createUserMock = jest
  //     .spyOn(usersController, "createUser")
  //     .mockRejectedValueOnce(usersFixtures.userOutPut);

  //   const response = await supertest(app)
  //     .post(api + "/create")
  //     .send(usersFixtures.userInput);

  //   expect(response.status).toEqual(200);
  //   expect(response.body).toEqual(usersFixtures.userOutPut);
  //   expect(response.type).toEqual("application/json");

  //   expect(createUserMock).toHaveBeenCalledWith(usersFixtures.userInput);
  // });
  //no missing fields
  //passwords must match
  //handle errors
  test("should return 406, Missing Values", async () => {
    const response = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.invalidUserInput);
    expect(response.status).toEqual(406);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(usersFixtures.errorObject);
  });
  //no duplicate emails

  // create a user session
  //a user can login with a valid email and password

  //a user can logout successfully
});
