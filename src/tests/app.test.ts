import createServer from "../app";
import request from "supertest";

const app = createServer();

describe("GET unknown route", () => {
  test("should return 404", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toEqual(404);
  });

  test("should return a json format", async () => {
    const response = await request(app).get("/unknown");
    expect(response.type).toBe("application/json");
  });
});
