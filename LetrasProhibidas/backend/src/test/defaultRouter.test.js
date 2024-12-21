import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";

describe("Default Router Tests", () => {
  describe("GET *", () => {
    it("should return 501", async () => {
      const res = await request(app).get("/random");

      expect(res.status).to.equal(501);
      expect(res.text).to.equal("Not implemented");
    });
  });
});
