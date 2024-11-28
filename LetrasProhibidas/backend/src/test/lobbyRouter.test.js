import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";

describe("Lobby Router", () => {
  describe("GET /lobby", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).get("/lobby");
      expect(res.status).to.equal(400);
    });
  });
});
