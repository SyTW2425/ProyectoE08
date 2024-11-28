import { expect } from "chai";
import sinon from "sinon";
import request from "supertest";
import { app } from "../appTest.js";
import { GameServices } from "../services/gameServices.js";

describe("Game Router Tests", () => {
  let gameServiceInstance;

  beforeEach(() => {
    gameServiceInstance = GameServices.getInstance();

    sinon.stub(gameServiceInstance, "getGameById");
    sinon.stub(gameServiceInstance, "createGame");
    sinon.stub(gameServiceInstance, "deleteGame");
    sinon.stub(gameServiceInstance, "getGameByMongoId");
    sinon.stub(gameServiceInstance, "updateGameWinner");
    sinon.stub(gameServiceInstance, "deleteGameByMongoId");
    sinon.stub(gameServiceInstance, "getAllGames");
    sinon.stub(gameServiceInstance, "getAllUsersGames");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GET /game", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).get("/game");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with game details", async () => {
      const mockGame = {
        id: "game123",
        lobbyID: "lobby123",
        players: ["player1", "player2"],
      };

      gameServiceInstance.getGameById.resolves(mockGame);

      const res = await request(app).get("/game").query({ id: "game123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockGame);
    });

    it("should return 404 if game is not found", async () => {
      gameServiceInstance.getGameById.resolves(null);

      const res = await request(app).get("/game").query({ id: "game123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Juego no encontrado");
    });

    it("should return 500 if an error occurs", async () => {
      gameServiceInstance.getGameById.rejects(new Error("Database error"));

      const res = await request(app).get("/game").query({ id: "game123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener el juego por su ID");
    });
  });

  describe("GET /game/:id", () => {
    it("should return 200 with game details", async () => {
      const mockGame = {
        id: "game123",
        lobbyID: "lobby123",
        players: ["player1", "player2"],
      };

      gameServiceInstance.getGameByMongoId.resolves(mockGame);

      const res = await request(app).get("/game/game123");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockGame);
    });

    it("should return 404 if game is not found", async () => {
      gameServiceInstance.getGameByMongoId.resolves(null);

      const res = await request(app).get("/game/game123");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se encontró el juego por su ID de MongoDB");
    });

    it("should return 500 if an error occurs", async () => {
      gameServiceInstance.getGameByMongoId.rejects(new Error("Database error"));

      const res = await request(app).get("/game/game123");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener el juego por su ID de MongoDB"
      );
    });
  });

  describe("POST /game", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).post("/game").send({});

      expect(res.status).to.equal(400);
      expect(res.text).to.equal(
        "No se proporcionó el ID del lobby o jugadores"
      );
    });

    it("should return 200 with created game", async () => {
      const mockGame = {
        id: "game123",
        lobbyID: "lobby123",
        players: ["player1", "player2"],
      };

      gameServiceInstance.createGame.resolves(mockGame);

      const res = await request(app)
        .post("/game")
        .send({ lobbyID: "lobby123", players: ["player1", "player2"] });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockGame);
    });

    it("should return 404 if game is not created", async () => {
      gameServiceInstance.createGame.resolves(null);

      const res = await request(app)
        .post("/game")
        .send({ lobbyID: "lobby123", players: ["player1", "player2"] });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo crear el juego");
    });

    it("should return 500 if an error occurs", async () => {
      gameServiceInstance.createGame.rejects(new Error("Database error"));

      const res = await request(app)
        .post("/game")
        .send({ lobbyID: "lobby123", players: ["player1", "player2"] });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar crear el juego");
    });
  });

  describe("PATCH /game", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).patch("/game").send({ id: "game123" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID o el ganador");
    });

    it("should return 200 with updated game details", async () => {
      const mockGame = {
        id: "game123",
        lobbyID: "lobby123",
        players: ["player1", "player2"],
        winnerID: "winner123",
      };

      gameServiceInstance.updateGameWinner.resolves(mockGame);

      const res = await request(app)
        .patch("/game")
        .query({ id: "game123", winnerID: "winner123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockGame);
    });

    it("should return 404 if game is not found", async () => {
      gameServiceInstance.updateGameWinner.resolves(null);

      const res = await request(app)
        .patch("/game")
        .query({ id: "game123", winnerID: "winner123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar el ganador del juego");
    });

    it("should return 500 if an error occurs", async () => {
      gameServiceInstance.updateGameWinner.rejects(new Error("Database error"));

      const res = await request(app)
        .patch("/game")
        .query({ id: "game123", winnerID: "winner123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar actualizar el ganador del juego"
      );
    });
  });

  describe("DELETE /game", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).delete("/game");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with deleted game details", async () => {
      const mockGame = {
        id: "game123",
        lobbyID: "lobby123",
        players: ["player1", "player2"],
      };

      gameServiceInstance.deleteGame.resolves(mockGame);

      const res = await request(app).delete("/game").query({ id: "game123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockGame);
    });

    it("should return 404 if game is not found", async () => {
      gameServiceInstance.deleteGame.resolves(null);

      const res = await request(app).delete("/game").query({ id: "game123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar el juego");
    });

    it("should return 500 if an error occurs", async () => {
      gameServiceInstance.deleteGame.rejects(new Error("Database error"));

      const res = await request(app).delete("/game").query({ id: "game123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el juego");
    });
  });
});
