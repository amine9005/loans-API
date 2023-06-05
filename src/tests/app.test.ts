import app from "../app";
import request from "supertest";

describe("As User ", () => {
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
});
