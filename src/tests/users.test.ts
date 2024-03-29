import createServer from "../app";
import supertest from "supertest";
import { config } from "../config/config";
import usersFixtures from "./fixtures/users.fixtures";

import {
  connectToMemoryDB,
  disconnectFromMemoryDB,
  __DANGER__dropDataBase,
} from "../config/connectToTestDB";
const api = config.api.url + "/users";
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
    const getUserById = await supertest(app)
      .get(api + "/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(getUserById.status).toEqual(200);
    expect(getUserById.type).toEqual("application/json");
    expect(getUserById.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("Update User", () => {
  test("should return 200 a status message", async () => {
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
    const updateUser = await supertest(app)
      .put(api + "/update/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send(usersFixtures.userUpdate);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(updateUser.status).toEqual(200);
    expect(updateUser.type).toEqual("application/json");
    expect(updateUser.body).toEqual(usersFixtures.statusMessage);
  });
});

describe("Update User with No credentials ", () => {
  test("should return 401 an error message", async () => {
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
    const updateUser = await supertest(app)
      .put(api + "/update/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]])
      .send(usersFixtures.userUpdate);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(updateUser.status).toEqual(401);
    expect(updateUser.type).toEqual("application/json");
    expect(updateUser.body).toEqual(usersFixtures.errorObject);
  });
});

describe("Update User without credentials", () => {
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
    const updateUser = await supertest(app)
      .put(api + "/update/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`)
      .send({});
    console.log("help: " + JSON.stringify(postUser.body));

    expect(updateUser.status).toEqual(400);
    expect(updateUser.type).toEqual("application/json");
    expect(updateUser.body).toEqual(usersFixtures.errorObject);
  });
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
    const getUserByEmail = await supertest(app)
      .get(api + "/emails/" + postUser.body.user.email)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(getUserByEmail.status).toEqual(200);
    expect(getUserByEmail.type).toEqual("application/json");
    expect(getUserByEmail.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("Get User by email with no credentials", () => {
  test("should return 401 with an error", async () => {
    const getUserByEmail = await supertest(app).get(api + "/emails/test");

    expect(getUserByEmail.status).toEqual(401);
    expect(getUserByEmail.type).toEqual("application/json");
    console.log("body ", JSON.stringify(getUserByEmail.body));
    expect(getUserByEmail.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
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

describe("Get All Users with no credentials", () => {
  // user registration
  test("should return 401 with an error", async () => {
    const getAllUsers = await supertest(app).get(api);
    expect(getAllUsers.status).toEqual(401);
    expect(getAllUsers.type).toEqual("application/json");
    expect(getAllUsers.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

describe("Delete User by id", () => {
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
    const deleteUserById = await supertest(app)
      .delete(api + "/delete/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);
    // console.log("help: " + JSON.stringify(postUser.body));

    expect(deleteUserById.status).toEqual(200);
    expect(deleteUserById.type).toEqual("application/json");
    expect(deleteUserById.body).toEqual(
      expect.objectContaining(usersFixtures.statusMessage)
    );
  });
});

describe("Delete User by id with no credentials ", () => {
  test("should return 401 error a message", async () => {
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
    const deleteUserById = await supertest(app)
      .delete(api + "/delete/" + postUser.body.user._id)
      .set("Cookie", [...header["set-cookie"]]);
    // console.log("help: " + JSON.stringify(postUser.body));

    expect(deleteUserById.status).toEqual(401);
    expect(deleteUserById.type).toEqual("application/json");
    expect(deleteUserById.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});

// describe("Delete User by id, user does not exist", () => {
//   test("should return 500 with an error message", async () => {
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
//     const deleteUserById = await supertest(app)
//       .delete(api + "/delete/" + postUser.body.user._id)
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`);
//     // console.log("help: " + JSON.stringify(postUser.body));

//     expect(deleteUserById.status).toEqual(200);
//     expect(deleteUserById.type).toEqual("application/json");
//     expect(deleteUserById.body).toEqual(
//       expect.objectContaining(usersFixtures.statusMessage)
//     );

//     const deleteUserById2 = await supertest(app)
//       .delete(api + "/delete/" + postUser.body.user._id)
//       .set("Cookie", [...header["set-cookie"]])
//       .set("Authorization", `Bearer ${getUser.body.accessToken}`);
//     // console.log("help: " + JSON.stringify(postUser.body));

//     expect(deleteUserById2.status).toEqual(500);
//     expect(deleteUserById2.type).toEqual("application/json");
//     expect(deleteUserById2.body).toEqual(
//       expect.objectContaining(usersFixtures.errorObject)
//     );
//   });
// });

describe("Get User by Name", () => {
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
    const getUserByName = await supertest(app)
      .get(api + "/names/" + postUser.body.user.name)
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(getUserByName.status).toEqual(200);
    expect(getUserByName.type).toEqual("application/json");
    expect(getUserByName.body.user).toEqual(
      expect.objectContaining(usersFixtures.userOutput)
    );
  });
});

describe("Get User by Name User dos not exist", () => {
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
    const getUserByName = await supertest(app)
      .get(api + "/names/" + "unknown")
      .set("Cookie", [...header["set-cookie"]])
      .set("Authorization", `Bearer ${getUser.body.accessToken}`);
    console.log("help: " + JSON.stringify(postUser.body));

    expect(getUserByName.status).toEqual(200);
    expect(getUserByName.type).toEqual("application/json");
    expect(getUserByName.body.user).toEqual(expect.objectContaining([]));
  });
});

describe("Get User by Name with no credentials", () => {
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
    const getUserByName = await supertest(app).get(
      api + "/names/" + postUser.body.user.name
    );
    console.log("help: " + JSON.stringify(postUser.body));

    expect(getUserByName.status).toEqual(401);
    expect(getUserByName.type).toEqual("application/json");
    expect(getUserByName.body).toEqual(
      expect.objectContaining(usersFixtures.errorObject)
    );
  });
});
