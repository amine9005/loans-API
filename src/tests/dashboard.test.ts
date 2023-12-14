import createServer from "../app";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";
import productsFixtures from "./fixtures/products.fixtures";

import ordersFixtures from "./fixtures/orders.fixtures";
import {
  connectToMemoryDB,
  disconnectFromMemoryDB,
  __DANGER__dropDataBase,
} from "../config/connectToTestDB";

const api = config.api.url + "/dashboard";
const prodApi = config.api.url + "/products";
const authApi = config.api.url + "/auth";
const orderApi = config.api.url + "/orders";
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
// Returns the size of the inventory as a JSON response with a 200 status code when products are found.

describe("Inventory size", () => {
  test("should return the size of the inventory as a JSON response with a 200 status code when products are found", async () => {
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
    const getInventorySize = await supertest(app)
      .get(api + "/inventorySize")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getInventorySize.status).toEqual(200);
    expect(getInventorySize.type).toEqual("application/json");
    expect(getInventorySize.body.products).toEqual(0);

    const addProduct = await supertest(app)
      .post(orderApi + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productInput);

    expect(addProduct.status).toEqual(200);
    expect(addProduct.type).toEqual("application/json");
    expect(addProduct.body.product).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );

    const getInventorySize2 = await supertest(app)
      .get(api + "/inventorySize")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getInventorySize2.status).toEqual(200);
    expect(getInventorySize2.type).toEqual("application/json");
    expect(getInventorySize2.body.products).toEqual(1);
  });
});

describe("total orders", () => {
  test("should return the number of total orders as a JSON response with a 200 status code when orders are found", async () => {
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
    const getOrdersCount = await supertest(app)
      .get(api + "/orderSize")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getOrdersCount.status).toEqual(200);
    expect(getOrdersCount.type).toEqual("application/json");
    expect(getOrdersCount.body.orders).toEqual(0);

    const addOrder = await supertest(app)
      .post(orderApi + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(ordersFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(ordersFixtures.orderOutput)
    );

    const getOrdersCount2 = await supertest(app)
      .get(api + "/orderSize")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getOrdersCount2.status).toEqual(200);
    expect(getOrdersCount2.type).toEqual("application/json");
    expect(getOrdersCount2.body.orders).toEqual(1);
  });
});
