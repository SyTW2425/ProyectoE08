import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";
import { GameServices } from "../services/gameServices.js";
import sinon from "sinon";

describe("Game Router", () => {
  describe("GET /game", () => {
    it("should return game by gameID if the game exists", async () => {
      const res = await request(app)
        .get("/game")
        .query({ gameID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234" });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "gameID",
        "b1a1c1d1-e1f1-1234-5678-9abcdef01234"
      );
    });

    it("should return 404 if game not found by gameID", async () => {
      const res = await request(app)
        .get("/game")
        .query({ gameID: "nonexistent" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Juego no encontrado");
    });

    it("should return 400 if no gameID is provided", async () => {
      const res = await request(app).get("/game");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID del juego");
    });
  });

  describe("POST /game", () => {
    it("should create a new game and return it", async () => {
      const newGame = {
        gameID: "b4a4c4d4-e4f4-1234-5678-9abcdef01234",
        players: [
          "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
          "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
        ],
        winnerID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      };

      const res = await request(app).post("/game").send(newGame);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "gameID",
        "b4a4c4d4-e4f4-1234-5678-9abcdef01234"
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/game").send({ lobbyID: "1234" });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal(
        "No se proporcionó el ID del lobby, jugadores o ganador"
      );
    });
    it("should return 500 if there is an error creating the game", async () => {
      const newGame = {
        gameID: "b4a4c4d4-e4f4-1234-5678-9abcdef01234",
        players: ["player1", "player2"],
        winnerID: "player1",
      };

      const createGameStub = sinon
        .stub(GameServices.prototype, "createGame")
        .rejects(new Error("Error creating game"));

      const res = await request(app).post("/game").send(newGame);
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar crear el juego");

      createGameStub.restore();
    });
  });

  describe("PATCH /game", () => {
    it("should update the game winner and return 200", async () => {
      const res = await request(app).patch("/game").query({
        gameID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        winnerID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Ganador actualizado correctamente");
    });

    it("should return 404 if game not found for updating winner", async () => {
      const res = await request(app)
        .patch("/game")
        .query({ gameID: "nonexistent", winnerID: "player2" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar el ganador del juego");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).patch("/game").query({ id: "1234" });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID o el ganador");
    });

    it("should return 500 if there is an error updating the winner", async () => {
      const updateGameWinnerStub = sinon
        .stub(GameServices.prototype, "updateGameWinner")
        .rejects(new Error("Error updating winner"));

      const res = await request(app).patch("/game").query({
        gameID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        winnerID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar el ganador del juego"
      );

      updateGameWinnerStub.restore();
    });
  });

  describe("DELETE /game", () => {
    it("should delete the game and return 200", async () => {
      const res = await request(app)
        .delete("/game")
        .query({ gameID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234" });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Juego eliminado correctamente");
    });

    it("should return 404 if game not found for deletion", async () => {
      const res = await request(app)
        .delete("/game")
        .query({ gameID: "nonexistent" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el juego");
    });

    it("should return 400 if no ID is provided", async () => {
      const res = await request(app).delete("/game");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 500 if there is an error deleting the game", async () => {
      const deleteGameStub = sinon
        .stub(GameServices.prototype, "deleteGame")
        .rejects(new Error("Error deleting game"));

      const res = await request(app).delete("/game").query({ gameID: "1234" });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el juego");

      deleteGameStub.restore();
    });
  });
});
