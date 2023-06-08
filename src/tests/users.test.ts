import createServer from "../app";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";
// import { createUserService } from "../services/users.service";
import {
  connectToMemoryDB,
  disconnectFromMemoryDB,
  __DANGER__dropDataBase,
} from "../config/connectToTestDB";
const api = config.api.url + "/users";

// jest.mock("../services/users.service", () => {
//   return {
//     createUserService: jest.fn(() => {
//       return Promise.resolve([]);
//     }),
//   };
// });

const app = createServer();
beforeAll(async () => {
  await connectToMemoryDB();
});

afterEach(async () => {
  await __DANGER__dropDataBase();
});

afterAll(async () => {
  await disconnectFromMemoryDB();
});

describe("Registration", () => {
  // user registration
  test("should return 200 register user", async () => {
    const response = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.userInput);
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
  // test("should create a user", async () => {
  // });
  //passwords must match
  //handle errors
  test("should return 406 Missing Values", async () => {
    const response = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.invalidUserInput);
    expect(response.status).toEqual(406);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(usersFixtures.errorObject);
  });
  //no duplicate emails
  test("should return 409 and not create a user with the same email", async () => {
    const response = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.userInput);
    expect(response.status).toEqual(200);

    const response2 = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.userInput);
    expect(response2.status).toEqual(409);
  });

  // create a user session
  //a user can login with a valid email and password

  //a user can logout successfully
});

describe("get user by email", () => {
  test("should return 404 Unable to find user", async () => {
    const email = "user_user";
    const getUser = await supertest(app).get(api + `/byEmail/${email}`);
    expect(getUser.status).toEqual(404);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body.email).toBeUndefined();
    expect(getUser.body).toEqual(usersFixtures.errorObject);
  });
  test("should return 200 with a user", async () => {
    const postUser = await supertest(app)
      .post(api + "/create")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const email = "user_user";
    const getUser = await supertest(app).get(api + `/byEmail/${email}`);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body.user.email).toEqual(email);
    expect(getUser.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("get user by id", () => {
  test("should return 404 with an error", async () => {
    const id = "647e370770db17b0e0071a96";
    const response = await supertest(app).post(api + `/byId/${id}`);
    expect(response.status).toEqual(404);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(usersFixtures.errorObject);
  });

  test("should return 200 with a user", async () => {
    const postUser = await supertest(app)
      .post(api + `/create`)
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const id = postUser.body.user._id;
    const getUser = await supertest(app).get(api + `/byId/${id}`);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("get all users", () => {
  test("should return 200 empty json", async () => {
    const users = await supertest(app).get(api);
    expect(users.status).toEqual(401);
    expect(users.type).toEqual("application/json");
    expect(users.body).toEqual(usersFixtures.errorObject);
  });

  // test("should return 200 with 3 users", async () => {
  //   const size = 3;
  //   for (let i = 0; i < size; i++) {
  //     const postUser = await supertest(app)
  //       .post(api + "/create")
  //       .send(usersFixtures.createRandomUser());
  //     expect(postUser.status).toEqual(200);
  //   }

  //   const users = await supertest(app).get(api);
  //   expect(users.status).toEqual(200);
  //   expect(users.type).toEqual("application/json");
  //   expect(users.body.users).toHaveLength(size);
  //   for (let i = 0; i < size; i++) {
  //     expect(users.body.users[i]).toEqual(
  //       expect.objectContaining(usersFixtures.userOutput)
  //     );
  //   }
  // });
});
