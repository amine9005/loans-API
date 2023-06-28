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
const authApi = config.api.url + "/auth";

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

describe("Get User by id", () => {
  test("should return 200 with a user", async () => {
    const postUser = await supertest(app)
      .post(authApi + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const getUser = await supertest(app)
      .post(authApi + "/login")
      .send(usersFixtures.userLogin);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
    const { header } = getUser;
    const getAllUsers = await supertest(app)
      .get(api)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getAllUsers.status).toEqual(200);
    expect(getAllUsers.type).toEqual("application/json");
    expect(getAllUsers.body.users[0]).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("Get All Users", () => {
  // user registration
  test("should return 200 all users", async () => {
    const postUser = await supertest(app)
      .post(authApi + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const getUser = await supertest(app)
      .post(authApi + "/login")
      .send(usersFixtures.userLogin);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
    const { header } = getUser;
    const getAllUsers = await supertest(app)
      .get(api)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getAllUsers.status).toEqual(200);
    expect(getAllUsers.type).toEqual("application/json");
    expect(getAllUsers.body.users[0]).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});
