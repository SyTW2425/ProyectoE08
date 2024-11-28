import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";

describe("Lobby Router", () => {
  it("si no le pasamos una id en la query da un error 400", async () => {
    const res = await request(app).get("/lobby");
    expect(res.status).to.equal(400);
  });
});
