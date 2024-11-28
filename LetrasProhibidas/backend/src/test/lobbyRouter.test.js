import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import app from "../appTest.js";
import { LobbyServices } from "../services/lobbyServices.js";

describe("Lobby Router Tests (Mocked)", () => {
  let lobbyServiceInstance; // Aquí guardaremos la instancia real

  beforeEach(() => {
    // Obtener la instancia real del singleton de LobbyServices
    lobbyServiceInstance = LobbyServices.getInstance();

    // Stubear métodos relevantes de esa instancia
    sinon.stub(lobbyServiceInstance, "getLobbyById");
    sinon.stub(lobbyServiceInstance, "createLobby");
    sinon.stub(lobbyServiceInstance, "deleteLobby");
    sinon.stub(lobbyServiceInstance, "getLobbyByMongoId");
    sinon.stub(lobbyServiceInstance, "updateLobbyPlayers");
    sinon.stub(lobbyServiceInstance, "deleteLobbyByMongoId");
    sinon.stub(lobbyServiceInstance, "getAllLobbies");
    sinon.stub(lobbyServiceInstance, "getAllUserLobbies");
    sinon.stub(lobbyServiceInstance, "addPlayerToLobby");
    sinon.stub(lobbyServiceInstance, "removePlayerFromLobby");
    sinon.stub(lobbyServiceInstance, "getLobbyByHostID");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GET /lobby", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).get("/lobby");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with lobby details", async () => {
      const mockLobby = {
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      };

      lobbyServiceInstance.getLobbyById.resolves(mockLobby);

      const res = await request(app).get("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      });
    });

    it("should return 404 if lobby is not found", async () => {
      lobbyServiceInstance.getLobbyById.resolves(null);

      const res = await request(app).get("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Lobby no encontrado");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.getLobbyById.rejects(new Error("Database error"));

      const res = await request(app).get("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener el lobby por su ID");
    });
  });

  describe("GET /lobby/all", () => {
    it("should return 200 with all lobbies", async () => {
      const mockLobby = [
        {
          id: "lobby1",
          hostID: "host1",
          players: ["player1", "player2"],
          maxPlayers: 4,
        },
        {
          id: "lobby2",
          hostID: "host2",
          players: ["player3", "player4"],
          maxPlayers: 4,
        },
      ];

      // Simular el comportamiento del método stub
      lobbyServiceInstance.getAllLobbies.resolves(mockLobby);

      const res = await request(app).get("/lobby/all");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockLobby);
    });

    it("should return 404 if no lobbies are found", async () => {
      lobbyServiceInstance.getAllLobbies.resolves(null);

      const res = await request(app).get("/lobby/all");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Lobby no encontrado");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.getAllLobbies.rejects(new Error("Database error"));

      const res = await request(app).get("/lobby/all");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener todos los lobbies");
    });
  });

  describe("GET /lobby/:id", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).get("/lobby/");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with lobby details", async () => {
      const mockLobby = {
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      };

      lobbyServiceInstance.getLobbyByMongoId.resolves(mockLobby);

      const res = await request(app).get("/lobby/lobby123");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      });
    });

    it("should return 404 if lobby is not found", async () => {
      lobbyServiceInstance.getLobbyByMongoId.resolves(null);

      const res = await request(app).get("/lobby/lobby123");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Lobby no encontrado");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.getLobbyByMongoId.rejects(
        new Error("Database error")
      );

      const res = await request(app).get("/lobby/lobby123");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener el lobby por su ID de MongoDB"
      );
    });
  });

  describe("GET /lobby/all/:id", () => {
    it("should return 200 with all lobbies of a user", async () => {
      const mockLobbies = [
        {
          id: "lobby1",
          hostID: "host1",
          players: ["player1", "player2"],
          maxPlayers: 4,
        },
        {
          id: "lobby2",
          hostID: "host2",
          players: ["player3", "player4"],
          maxPlayers: 4,
        },
      ];

      lobbyServiceInstance.getAllUserLobbies.resolves(mockLobbies);

      const res = await request(app).get("/lobby/all/user123");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockLobbies);
    });

    it("should return 404 if no lobbies are found", async () => {
      lobbyServiceInstance.getAllUserLobbies.resolves(null);

      const res = await request(app).get("/lobby/all/user123");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudieron obtener los lobbies");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.getAllUserLobbies.rejects(
        new Error("Database error")
      );

      const res = await request(app).get("/lobby/all/user123");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar obtener los lobbies del usuario"
      );
    });
  });

  describe("POST /lobby", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).post("/lobby").send({});

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Missing parameters");
    });

    it("should return 200 with created lobby", async () => {
      lobbyServiceInstance.createLobby.resolves({
        id: "lobby123",
        hostID: "host123",
        players: ["player1"],
        maxPlayers: 4,
      });

      const res = await request(app)
        .post("/lobby")
        .send({ hostID: "host123", players: ["player1"], maxPlayers: 4 });

      expect(res.status).to.equal(200);
      expect(res.body).to.include({ hostID: "host123", maxPlayers: 4 });
    });

    it("should return 404 if lobby could not be created", async () => {
      lobbyServiceInstance.createLobby.resolves(null);

      const res = await request(app)
        .post("/lobby")
        .send({ hostID: "host123", players: ["player1"], maxPlayers: 4 });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo crear el lobby");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.createLobby.rejects(new Error("Database error"));

      const res = await request(app)
        .post("/lobby")
        .send({ hostID: "host123", players: ["player1"], maxPlayers: 4 });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar crear el lobby");
    });
  });

  describe("PATCH /lobby", () => {
    it("should return 400 if required parameters are missing", async () => {
      const res = await request(app).patch("/lobby").send({ id: "lobby123" });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID o los jugadores");
    });

    it("should return 200 with updated lobby details", async () => {
      const mockLobby = {
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      };

      lobbyServiceInstance.updateLobbyPlayers.resolves(mockLobby);

      const res = await request(app)
        .patch("/lobby")
        .query({ id: "lobby123" })
        .send({ players: ["player1", "player2"] });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        id: "lobby123",
        hostID: "host123",
        players: ["player1", "player2"],
        maxPlayers: 4,
      });
    });

    it("should return 404 if lobby is not found", async () => {
      lobbyServiceInstance.updateLobbyPlayers.resolves(null);

      const res = await request(app)
        .patch("/lobby")
        .query({ id: "lobby123" })
        .send({ players: ["player1", "player2"] });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar el lobby");
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.updateLobbyPlayers.rejects(
        new Error("Database error")
      );

      const res = await request(app)
        .patch("/lobby")
        .query({ id: "lobby123" })
        .send({ players: ["player1", "player2"] });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar actualizar el lobby");
    });
  });

  describe("DELETE /lobby", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).delete("/lobby");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with deleted lobby details", async () => {
      // Mock del método deleteLobby
      lobbyServiceInstance.deleteLobby.resolves({ id: "lobby123" });

      const res = await request(app).delete("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: "lobby123" });
    });

    it("should return 404 if lobby is not found", async () => {
      // Mock para simular que no se puede eliminar
      lobbyServiceInstance.deleteLobby.resolves(null);

      const res = await request(app).delete("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar");
    });

    it("should return 500 if an error occurs", async () => {
      // Mock para simular un error
      lobbyServiceInstance.deleteLobby.rejects(new Error("Database error"));

      const res = await request(app).delete("/lobby").query({ id: "lobby123" });

      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el lobby");
    });
  });

  describe("DELETE /lobby/:id", () => {
    it("should return 400 if no id is provided", async () => {
      const res = await request(app).delete("/lobby/");

      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 200 with deleted lobby details", async () => {
      lobbyServiceInstance.deleteLobbyByMongoId.resolves({ id: "lobby123" });

      const res = await request(app).delete("/lobby/lobby123");

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ id: "lobby123" });
    });

    it("should return 404 if lobby is not found", async () => {
      lobbyServiceInstance.deleteLobbyByMongoId.resolves(null);

      const res = await request(app).delete("/lobby/lobby123");

      expect(res.status).to.equal(404);
      expect(res.text).to.equal(
        "No se pudo eliminar el lobby por su ID de MongoDB"
      );
    });

    it("should return 500 if an error occurs", async () => {
      lobbyServiceInstance.deleteLobbyByMongoId.rejects(
        new Error("Database error")
      );

      const res = await request(app).delete("/lobby/lobby123");

      expect(res.status).to.equal(500);
      expect(res.text).to.equal(
        "Error al intentar eliminar el lobby por su ID de MongoDB"
      );
    });
  });
});
