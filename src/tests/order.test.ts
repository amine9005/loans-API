import createServer from "../app";
import {
  connectToMemoryDB,
  __DANGER__dropDataBase,
  disconnectFromMemoryDB,
} from "../config/connectToTestDB";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";
import orderFixtures from "./fixtures/orders.fixtures";

const api = config.api.url + "/orders";
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

describe("Add Order", () => {
  test("should return 200 with an order", async () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
  });
});

describe("addOrder without authorization", () => {
  test("should return 401 with an error", async () => {
    const addOrder = await supertest(app)
      .post(api + "/add")
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(401);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("addOrder without Missing values", () => {
  test("should return 401 with an error", async () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send({});

    expect(addOrder.status).toEqual(400);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Get Orders", () => {
  test("should return 200 with an orders List", async () => {
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
    const size = 3;
    for (let i = 0; i < size; i++) {
      const addOrder = await supertest(app)
        .post(api + "/add")
        .set("Cookie", [...header["set-cookie"]])
        .set("Authorization", `Bearer ${getUser.body.accessToken}`)
        .send(orderFixtures.orderInput);

      expect(addOrder.status).toEqual(200);
      expect(addOrder.type).toEqual("application/json");
      expect(addOrder.body.order).toEqual(
        expect.objectContaining(orderFixtures.orderOutput)
      );
    }

    const getOrders = await supertest(app)
      .get(api + "/")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getOrders.status).toEqual(200);
    expect(getOrders.type).toEqual("application/json");
    for (let i = 0; i < size; i++) {
      expect(getOrders.body.orders[i]).toEqual(
        expect.objectContaining(orderFixtures.orderOutput)
      );
    }
  });
});

describe("Get Orders without authorization", () => {
  test("should return 401 with an error", async () => {
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
    const size = 3;
    for (let i = 0; i < size; i++) {
      const addOrder = await supertest(app)
        .post(api + "/add")
        .set("Cookie", [...header["set-cookie"]])
        .set("Authorization", `Bearer ${getUser.body.accessToken}`)
        .send(orderFixtures.orderInput);

      expect(addOrder.status).toEqual(200);
      expect(addOrder.type).toEqual("application/json");
      expect(addOrder.body.order).toEqual(
        expect.objectContaining(orderFixtures.orderOutput)
      );
    }

    const getOrders = await supertest(app).get(api + "/");

    expect(getOrders.status).toEqual(401);
    expect(getOrders.type).toEqual("application/json");
    expect(getOrders.body).toEqual(usersFixtures.errorObject);
  });
});

describe("Update Order", () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
    const { _id } = addOrder.body.order;

    const updateOrder = await supertest(app)
      .put(api + "/update/" + _id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderUpdate);

    expect(updateOrder.status).toEqual(200);
    expect(updateOrder.type).toEqual("application/json");
    expect(updateOrder.body).toEqual(
      expect.objectContaining(usersFixtures.statusMessage)
    );
  });
});

describe("Update Order without authorization", () => {
  test("should return 401 with an error message", async () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderUpdate);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
    const { _id } = addOrder.body.order;

    const updateOrder = await supertest(app)
      .put(api + "/update/" + _id)
      .send(orderFixtures.orderUpdate);

    expect(updateOrder.status).toEqual(401);
    expect(updateOrder.type).toEqual("application/json");
    expect(updateOrder.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Update Order with missing values", () => {
  test("should return 400 with an error message", async () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
    const { _id } = addOrder.body.order;

    const updateOrder = await supertest(app)
      .put(api + "/update/" + _id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send({});

    expect(updateOrder.status).toEqual(400);
    expect(updateOrder.type).toEqual("application/json");
    expect(updateOrder.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Delete Order", () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
    const { _id } = addOrder.body.order;

    const deleteOrder = await supertest(app)
      .delete(api + "/delete/" + _id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(deleteOrder.status).toEqual(200);
    expect(deleteOrder.type).toEqual("application/json");
    expect(deleteOrder.body).toEqual(
      expect.objectContaining(usersFixtures.statusMessage)
    );
  });
});

describe("Delete Order without authorization", () => {
  test("should return 401 with an error message", async () => {
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
    const addOrder = await supertest(app)
      .post(api + "/add")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(orderFixtures.orderInput);

    expect(addOrder.status).toEqual(200);
    expect(addOrder.type).toEqual("application/json");
    expect(addOrder.body.order).toEqual(
      expect.objectContaining(orderFixtures.orderOutput)
    );
    const { _id } = addOrder.body.order;

    const deleteOrder = await supertest(app).delete(api + "/delete/" + _id);

    expect(deleteOrder.status).toEqual(401);
    expect(deleteOrder.type).toEqual("application/json");
    expect(deleteOrder.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});
