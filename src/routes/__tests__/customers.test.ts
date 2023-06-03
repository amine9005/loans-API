import app from "../../app";
import request from "supertest";

describe("As Administrator", () => {
  describe("In need of the customers page", () => {
    describe("Given GET /", () => {
      test("should return 200", async () => {
        const response = await request(app).get(
          "/api/v1/loan_manager/customers"
        );
        expect(response.status).toEqual(200);
      });

      test("should return 200", async () => {
        const response = await request(app).get(
          "/api/v1/loan_manager/customers"
        );
        expect(response.type).toEqual("application/json");
      });

      test("should return 200", async () => {
        const response = await request(app).get(
          "/api/v1/loan_manager/customers"
        );
        expect(response.body.data).toBeDefined();
      });
    });
  });
});
