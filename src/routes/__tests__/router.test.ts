import app from "../../app";
import request from "supertest";

describe("As User ", () => {
  describe("In need of home page", () => {
    describe("Given GET /", () => {
      test("should return 200", async () => {
        const response = await request(app).get("/api/v1/loan_manager/");
        expect(response.status).toEqual(200);
      });

      test("should return a json format", async () => {
        const response = await request(app).get("/api/v1/loan_manager/");
        expect(response.type).toEqual("application/json");
      });

      test("it should return data in the body", async () => {
        const response = await request(app).get("/api/v1/loan_manager/");
        expect(response.body.data).toBeDefined();
      });
    });
  });
});
