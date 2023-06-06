import { config } from "../config/config";
import createServer from "../app";
import supertest from "supertest";

const app = createServer();

const api = config.api.url;

describe("Home Page", () => {
  test("should return 200", async () => {
    const response = await supertest(app).get(api);
    expect(response.status).toEqual(200);
  });

  test("should return a json format", async () => {
    const response = await supertest(app).get(api);
    expect(response.type).toEqual("application/json");
  });

  test("it should return data in the body", async () => {
    const response = await supertest(app).get(api);
    expect(response.body.data).toBeDefined();
  });
});
