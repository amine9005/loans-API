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

describe("Add A Product", () => {
  test("should return 200 with a Product", async () => {
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
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });

  describe("add product with no credentials", () => {
    test("should return 401 with an error", async () => {
      const addProduct = await supertest(app)
        .post(api + "/add")
        .send(productsFixtures.productInput);
      expect(addProduct.status).toEqual(401);
      expect(addProduct.type).toEqual("application/json");
      expect(addProduct.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });
});

describe("get Products", () => {
  test("should return 200 with a Products", async () => {
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
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
    const getProducts = await supertest(app)
      .get(api + "/")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });

  describe("get Products with no credentials ", () => {
    test("should return 401 with an error", async () => {
      const getProducts = await supertest(app).get(api + "/");

      expect(getProducts.status).toEqual(401);
      expect(getProducts.type).toEqual("application/json");
      expect(getProducts.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });
});

describe("get Product by id", () => {
  test("should return 200 with a Product", async () => {
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
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );

    const id = addProduct.body.product._id;
    const getProducts = await supertest(app)
      .get(api + "/" + id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    expect(getProducts.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
    expect(getProducts.body.product._id).toEqual(id);
  });

  describe("get Products with no credentials ", () => {
    test("should return 401 with an error", async () => {
      const getProducts = await supertest(app).get(api + "/4425");

      expect(getProducts.status).toEqual(401);
      expect(getProducts.type).toEqual("application/json");
      expect(getProducts.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });
});

describe("delete product", () => {
  test("should return 200 with a message", async () => {
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
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );

    const id = addProduct.body.product._id;
    const deleteProduct = await supertest(app)
      .delete(api + "/delete/" + id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(deleteProduct.status).toEqual(200);
    expect(deleteProduct.type).toEqual("application/json");
    expect(deleteProduct.body).toEqual(
      expect.objectContaining(usersFixtures.statusMessage)
    );

    // const getProduct = await supertest(app)
    //   .get(api + "/" + id)
    //   .set("Cookie", [...header["set-cookie"]])
    //   .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    // expect(getProduct.status).toEqual(404);
    // expect(getProduct.type).toEqual("application/json");
    // expect(getProduct.body).toEqual(
    //   expect.objectContaining(usersFixtures.errorObject)
    // );
  });

  describe("delete Products with no credentials ", () => {
    test("should return 401 with an error", async () => {
      const getProducts = await supertest(app).delete(api + "/delete/1");

      expect(getProducts.status).toEqual(401);
      expect(getProducts.type).toEqual("application/json");
      expect(getProducts.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });
});
