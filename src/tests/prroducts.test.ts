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

  describe("Add Products with Missing values", () => {
    test("should return 400 with an error", async () => {
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
        .send({});

      expect(addProduct.status).toEqual(400);
      expect(addProduct.type).toEqual("application/json");
      expect(addProduct.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
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

describe("Update product", () => {
  test("should return 200 with an updated product", async () => {
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
    const updateProduct = await supertest(app)
      .put(api + "/update/" + id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(productsFixtures.productUpdated);

    expect(updateProduct.status).toEqual(200);
    expect(updateProduct.type).toEqual("application/json");
    expect(updateProduct.body).toEqual(
      expect.objectContaining(productsFixtures.messageObject)
    );
  });
  describe("Update Products with Missing values", () => {
    test("should return 400 with an error", async () => {
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
      const updateProduct = await supertest(app)
        .put(api + "/update/" + id)
        .set("Cookie", [...header["set-cookie"]])
        .set("Authorization", `Bearer ${getUser.body.accessToken}`)
        .send({});

      expect(updateProduct.status).toEqual(400);
      expect(updateProduct.type).toEqual("application/json");
      expect(updateProduct.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });

  describe("Update Products with No credentials", () => {
    test("should return 400 with an error", async () => {
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
      const updateProduct = await supertest(app).put(api + "/update/" + id);

      expect(updateProduct.status).toEqual(401);
      expect(updateProduct.type).toEqual("application/json");
      expect(updateProduct.body).toEqual(
        expect.objectContaining(usersFixtures.errorObject)
      );
    });
  });
});

describe("Find Product By Name", () => {
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
      .get(api + "/getByName/" + addProduct.body.product.name)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Name Without credentials ", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByName/" + addProduct.body.product.name
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Name Product Not Found ", () => {
  test("should return 200 with an empty list", async () => {
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
      .get(api + "/getByName/" + "none")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Price", () => {
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
      .get(api + "/getByPriceGreater/" + addProduct.body.product.price)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Price Without credentials ", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByPriceGreater/" + addProduct.body.product.price
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Name Product Not Found ", () => {
  test("should return 200 with an empty list", async () => {
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
      .get(api + "/getByPriceGreater/" + "5000")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Price Lower Than", () => {
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
      .get(api + "/getByPriceLower/" + addProduct.body.product.price)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Price Lower Than With No Credentials", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByPriceLower/" + addProduct.body.product.price
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Price Lower Than, Product Not Found", () => {
  test("should return 200 with a empty list", async () => {
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
      .get(api + "/getByPriceLower/" + "-1")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Quantity Greater Than", () => {
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
      .get(api + "/getByQuantityGreater/" + addProduct.body.product.quantity)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Quantity Greater Than With No Credentials", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByQuantityGreater/" + addProduct.body.product.price
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Quantity Greater Than, Product Not Found", () => {
  test("should return 200 with a empty list", async () => {
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
      .get(api + "/getByQuantityGreater/" + "99999")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Quantity Lower Than", () => {
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
      .get(api + "/getByQuantityLower/" + addProduct.body.product.quantity)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Quantity Lower Than With No Credentials", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByQuantityLower/" + addProduct.body.product.price
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Quantity Lower Than, Product Not Found", () => {
  test("should return 200 with a empty list", async () => {
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
      .get(api + "/getByQuantityLower/" + "-1")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Price Equal To X", () => {
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
      .get(api + "/getByPriceEqual/" + addProduct.body.product.price)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Price Equal To X With No Credentials", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByPriceEqual/" + addProduct.body.product.price
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Price Equal To X, Product Not Found", () => {
  test("should return 200 with a empty list", async () => {
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
      .get(api + "/getByPriceEqual/" + "-1")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

describe("Find Product By Quantity Equal To X", () => {
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
      .get(api + "/getByQuantityEqual/" + addProduct.body.product.quantity)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products[0]).toEqual(
      expect.objectContaining(productsFixtures.productOutput)
    );
  });
});

describe("Find Product By Quantity Equal To X With No Credentials", () => {
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

    const getProducts = await supertest(app).get(
      api + "/getByQuantityEqual/" + addProduct.body.product.quantity
    );

    expect(getProducts.status).toEqual(401);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Find Product By Quantity Equal To X, Product Not Found", () => {
  test("should return 200 with a empty list", async () => {
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
      .get(api + "/getByQuantityEqual/" + "-1")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);

    expect(getProducts.status).toEqual(200);
    expect(getProducts.type).toEqual("application/json");
    // console.log("Products found: ", JSON.stringify(getProducts.body));
    expect(getProducts.body.products).toEqual([]);
  });
});

// describe("Get Product Image", () => {
//   test("should return 200 with an image", async () => {
//     const postUser = await supertest(app)
//       .post(authApi + "/register")
//       .send(usersFixtures.userInput);
//     expect(postUser.status).toEqual(200);
//     const getUser = await supertest(app)
//       .post(authApi + "/login")
//       .send(usersFixtures.userLogin);
//     expect(getUser.status).toEqual(200);
//     expect(getUser.type).toEqual("application/json");
//     expect(getUser.body).toEqual(
//       expect.objectContaining(usersFixtures.accessToken)
//     );
//     const { header } = getUser;
//     const addProduct = await supertest(app)
//       .post(api + "/add")
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`)
//       .send(productsFixtures.productInput);

//     expect(addProduct.status).toEqual(200);
//     expect(addProduct.type).toEqual("application/json");
//     expect(addProduct.body.product).toEqual(
//       expect.objectContaining(productsFixtures.productOutput)
//     );

//     const route = api + "/getImage/" + "1700371665206.png";
//     console.log("image route: ", route);
//     const getProducts = await supertest(app)
//       .get(api + "/getImage/" + "1700371665206.png")
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`);

//     expect(getProducts.status).toEqual(200);
//     expect(getProducts.type).toEqual("image/jpeg");
//   });
// });

// describe("Get Product Image, With No Credentials", () => {
//   test("should return 401 with an error", async () => {
//     const postUser = await supertest(app)
//       .post(authApi + "/register")
//       .send(usersFixtures.userInput);
//     expect(postUser.status).toEqual(200);
//     const getUser = await supertest(app)
//       .post(authApi + "/login")
//       .send(usersFixtures.userLogin);
//     expect(getUser.status).toEqual(200);
//     expect(getUser.type).toEqual("application/json");
//     expect(getUser.body).toEqual(
//       expect.objectContaining(usersFixtures.accessToken)
//     );
//     const { header } = getUser;
//     const addProduct = await supertest(app)
//       .post(api + "/add")
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`)
//       .send(productsFixtures.productInput);

//     expect(addProduct.status).toEqual(200);
//     expect(addProduct.type).toEqual("application/json");
//     expect(addProduct.body.product).toEqual(
//       expect.objectContaining(productsFixtures.productOutput)
//     );

//     const getProducts = await supertest(app).get(
//       api + "/getImage/" + "1700371665206.png"
//     );

//     expect(getProducts.status).toEqual(401);
//     expect(getProducts.type).toEqual("application/json");
//     // console.log("Products found: ", JSON.stringify(getProducts.body));
//     expect(getProducts.body).toEqual(
//       expect.objectContaining(usersFixtures.errorObject)
//     );
//   });
// });

// describe("Get Product Image, Image Doesn't exist", () => {
//   test("should return 404 with an error", async () => {
//     const postUser = await supertest(app)
//       .post(authApi + "/register")
//       .send(usersFixtures.userInput);
//     expect(postUser.status).toEqual(200);
//     const getUser = await supertest(app)
//       .post(authApi + "/login")
//       .send(usersFixtures.userLogin);
//     expect(getUser.status).toEqual(200);
//     expect(getUser.type).toEqual("application/json");
//     expect(getUser.body).toEqual(
//       expect.objectContaining(usersFixtures.accessToken)
//     );
//     const { header } = getUser;
//     const addProduct = await supertest(app)
//       .post(api + "/add")
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`)
//       .send(productsFixtures.productInput);

//     expect(addProduct.status).toEqual(200);
//     expect(addProduct.type).toEqual("application/json");
//     expect(addProduct.body.product).toEqual(
//       expect.objectContaining(productsFixtures.productOutput)
//     );

//     const route = api + "/getImage/" + "000000.png";
//     console.log("image route: ", route);
//     const getProducts = await supertest(app)
//       .get(api + "/getImage/" + "000000.png")
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`);

//     expect(getProducts.status).toEqual(404);
//     expect(getProducts.type).toEqual("content/json");
//     expect(getProducts.body).toContain(usersFixtures.errorObject);
//   });
// });
