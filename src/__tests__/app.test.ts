import app from "../app";
import request from "supertest";

describe("As User ", () => {
  describe("GET unknown route", () => {
    test("should return 404", () => {
      request(app).get("/unknown").expect(404);
    });

    test("should return a json format", async () => {
      const response = await request(app).get("/unknown");
      expect(response.type).toBe("application/json");
    });
  });

  describe("GET Audits route", () => {
    test("should return 200", () => {
      request(app).get("/audits").expect(200);
    });
  });
});
