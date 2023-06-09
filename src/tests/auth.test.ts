import createServer from "../app";
import {
  connectToMemoryDB,
  __DANGER__dropDataBase,
  disconnectFromMemoryDB,
} from "../config/connectToTestDB";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";

const api = config.api.url + "/auth";
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
  test("should return 200 with a user", async () => {
    const postUser = await supertest(app)
      .post(api + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    expect(postUser.type).toEqual("application/json");
    expect(postUser.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("Login ", () => {
  test("should return 200 with a user", async () => {
    const postUser = await supertest(app)
      .post(api + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const getUser = await supertest(app)
      .get(api + "/login")
      .send(usersFixtures.userLogin);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
  });
});

describe("Refresh endpoint for user token", () => {
  test("should return 200 with new access token", async () => {
    const postUser = await supertest(app)
      .post(api + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const getUser = await supertest(app)
      .get(api + "/login")
      .send(usersFixtures.userLogin);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
    const { header } = getUser;
    const oldToken = getUser.body;
    const refreshToken = await supertest(app)
      .get(api + "/refresh")
      .set("Cookie", [...header["set-cookie"]]);

    expect(refreshToken.status).toEqual(200);
    expect(refreshToken.type).toEqual("application/json");
    expect(refreshToken.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
    const newToken = refreshToken.body;
    expect(newToken).not.toEqual(oldToken);
  });
});

describe("Logout", () => {
  test("should return 200", async () => {
    const postUser = await supertest(app)
      .post(api + "/register")
      .send(usersFixtures.userInput);
    expect(postUser.status).toEqual(200);
    const getUser = await supertest(app)
      .get(api + "/login")
      .send(usersFixtures.userLogin);
    expect(getUser.status).toEqual(200);
    expect(getUser.type).toEqual("application/json");
    expect(getUser.body).toEqual(
      expect.objectContaining(usersFixtures.accessToken)
    );
    const { header } = getUser;
    const logoutResp = await supertest(app)
      .post(api + "/logout")
      .set("Cookie", [...header["set-cookie"]]);

    expect(logoutResp.status).toEqual(200);
    expect(logoutResp.type).toEqual("application/json");
    expect(logoutResp.body).toEqual(
      expect.objectContaining(usersFixtures.statusMessage)
    );
  });
});
