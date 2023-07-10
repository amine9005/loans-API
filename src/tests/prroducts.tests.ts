import createServer from "../app";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";
import productsFixtures from "./fixtures/products.fixtures";

import {
  connectToMemoryDB,
  disconnectFromMemoryDB,
  __DANGER__dropDataBase,
} from "../config/connectToTestDB";
const api = config.api.url + "/products";
const authApi = config.api.url + "/auth";

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

describe("Get User by id with no credentials", () => {
  test("should return 401 with an error", async () => {
    const getUserById = await supertest(app).get(api + "/0");

    expect(getUserById.status).toEqual(401);
    expect(getUserById.type).toEqual("application/json");
    console.log("body ", JSON.stringify(getUserById.body));
    expect(getUserById.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Get User by email", () => {
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
    const addProduct = await supertest(app)
      .get(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.user).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});
