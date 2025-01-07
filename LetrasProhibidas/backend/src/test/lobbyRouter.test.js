import request from "supertest";
import { expect } from "chai";
import app from "../appTest.js";
import { LobbyServices } from "../services/lobbyServices.js";
import sinon from "sinon";

describe("Lobby Router", () => {
  describe("GET /lobby", () => {
    it("should return lobby by lobbyID if the lobby exists", async () => {
      const res = await request(app)
        .get("/lobby")
        .query({ lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234" });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "lobbyID",
        "b1a1c1d1-e1f1-1234-5678-9abcdef01234"
      );
    });

    it("should return 404 if lobby not found by lobbyID", async () => {
      const res = await request(app)
        .get("/lobby")
        .query({ lobbyID: "nonexistent" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Lobby no encontrado");
    });

    it("should return 400 if no lobbyID is provided", async () => {
      const res = await request(app).get("/lobby");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });
  });

  describe("GET /lobby/all", () => {
    it("should return all lobbies", async () => {
      const res = await request(app).get("/lobby/all");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 500 if there is an error fetching lobbies", async () => {
      const getAllLobbiesStub = sinon
        .stub(LobbyServices.prototype, "getAllLobbies")
        .rejects(new Error("Error fetching lobbies"));

      const res = await request(app).get("/lobby/all");
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener todos los lobbies");

      getAllLobbiesStub.restore();
    });
  });

  describe("POST /lobby", () => {
    it("should create a new lobby and return it", async () => {
      const newLobby = {
        hostID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        players: ["b1a1c1d1-e1f1-1234-5678-9abcdef01234"],
        maxPlayers: 4,
      };

      const res = await request(app).post("/lobby").send(newLobby);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("hostID", newLobby.hostID);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/lobby").send({ hostID: "1234" });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Missing parameters");
    });

    it("should return 500 if there is an error creating the lobby", async () => {
      const newLobby = {
        hostID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        players: ["b1a1c1d1-e1f1-1234-5678-9abcdef01234"],
        maxPlayers: 4,
      };

      const createLobbyStub = sinon
        .stub(LobbyServices.prototype, "createLobby")
        .rejects(new Error("Error creating lobby"));

      const res = await request(app).post("/lobby").send(newLobby);
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar crear el lobby");

      createLobbyStub.restore();
    });
  });

  describe("PATCH /lobby", () => {
    it("should update the lobby players and return 200", async () => {
      const res = await request(app)
        .patch("/lobby")
        .query({
          lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        })
        .send({
          players: [
            "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
            "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
            "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
            "b4a4c4d4-e4f4-1234-5678-9abcdef01234",
          ],
        });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Lobby actualizado correctamente");
    });

    it("should return 404 if lobby not found for updating players", async () => {
      const res = await request(app)
        .patch("/lobby")
        .query({
          lobbyID: "nonexistent",
        })
        .send({
          players: ["player1", "player2"],
        });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo actualizar el lobby");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).patch("/lobby").query({ id: "1234" });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID o los jugadores");
    });

    it("should return 500 if there is an error updating the players", async () => {
      const updateLobbyPlayersStub = sinon
        .stub(LobbyServices.prototype, "updateLobbyPlayers")
        .rejects(new Error("Error updating players"));

      const res = await request(app)
        .patch("/lobby")
        .query({
          lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
        })
        .send({
          players: [
            "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
            "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
          ],
        });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar actualizar el lobby");

      updateLobbyPlayersStub.restore();
    });
  });

  describe("DELETE /lobby", () => {
    it("should delete the lobby and return 200", async () => {
      const res = await request(app)
        .delete("/lobby")
        .query({ lobbyID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234" });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Lobby eliminado correctamente");
    });

    it("should return 404 if lobby not found for deletion", async () => {
      const res = await request(app)
        .delete("/lobby")
        .query({ lobbyID: "nonexistent" });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("No se pudo eliminar");
    });

    it("should return 400 if no ID is provided", async () => {
      const res = await request(app).delete("/lobby");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID");
    });

    it("should return 500 if there is an error deleting the lobby", async () => {
      const deleteLobbyStub = sinon
        .stub(LobbyServices.prototype, "deleteLobby")
        .rejects(new Error("Error deleting lobby"));

      const res = await request(app)
        .delete("/lobby")
        .query({ lobbyID: "1234" });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar eliminar el lobby");

      deleteLobbyStub.restore();
    });
  });

  describe("GET /lobby/status", () => {
    it("should return the status of the lobby", async () => {
      const res = await request(app).get("/lobby/status").send({
        lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("joinable", true);
    });

    it("should return 400 if there is an error fetching the status", async () => {
      const getLobbyStatusStub = sinon
        .stub(LobbyServices.prototype, "getLobbyStatus")
        .rejects(new Error("No se proporcionó el ID del lobby"));

      const res = await request(app).get("/lobby/status").query({
        lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID del lobby");

      getLobbyStatusStub.restore();
    });
  });

  describe("PATCH /lobby/status", () => {
    it("should update the status of the lobby and return 200", async () => {
      const res = await request(app).patch("/lobby/status").send({
        lobbyID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
        lobbyStatus: "true",
      });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Estado actualizado correctamente");
    });

    it("should return 400 if there is an error fetching the status", async () => {
      const getLobbyStatusStub = sinon
        .stub(LobbyServices.prototype, "getLobbyStatus")
        .rejects(new Error("Error fetching status"));

      const res = await request(app).get("/lobby/status").query({
        lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID del lobby");

      getLobbyStatusStub.restore();
    });
  });

  describe("GET /lobby/privacy", () => {
    it("should return the privacy of the lobby", async () => {
      const res = await request(app).get("/lobby/privacy").send({
        lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("private", false);
    });

    it("should return 400 if no lobbyID is provided", async () => {
      const res = await request(app).get("/lobby/privacy");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("No se proporcionó el ID del lobby");
    });

    it("should return 500 if there is an error fetching the privacy", async () => {
      const getLobbyPrivacyStub = sinon
        .stub(LobbyServices.prototype, "getLobbyPrivacy")
        .rejects(new Error("Error fetching privacy"));

      const res = await request(app).get("/lobby/privacy").send({
        lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error fetching privacy");

      getLobbyPrivacyStub.restore();
    });
  });

  describe("PATCH /lobby/privacy", () => {
    it("should update the privacy of the lobby and return 200", async () => {
      const res = await request(app).patch("/lobby/privacy").send({
        lobbyID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
        lobbyPrivate: true,
      });
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("Privacidad actualizada correctamente");
    });

    it("should return 400 if no lobbyID is provided", async () => {
      const res = await request(app).patch("/lobby/privacy").send({
        lobbyPrivate: true,
      });
      expect(res.status).to.equal(404);
      expect(res.text).to.equal("Lobby no encontrado");
    });

    it("should return 500 if there is an error updating the privacy", async () => {
      const setLobbyPrivacyStub = sinon
        .stub(LobbyServices.prototype, "setLobbyPrivacy")
        .rejects(new Error("Error updating privacy"));

      const res = await request(app).patch("/lobby/privacy").send({
        lobbyID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
        private: true,
      });
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error updating privacy");

      setLobbyPrivacyStub.restore();
    });
  });

  describe("GET /lobby/all/public", () => {
    it("should return all public lobbies", async () => {
      const res = await request(app).get("/lobby/all/public");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 500 if there is an error fetching public lobbies", async () => {
      const getAllPublicLobbyStub = sinon
        .stub(LobbyServices.prototype, "getAllPublicLobby")
        .rejects(new Error("Error fetching public lobbies"));

      const res = await request(app).get("/lobby/all/public");
      expect(res.status).to.equal(500);
      expect(res.text).to.equal("Error al intentar obtener todos los lobbies");

      getAllPublicLobbyStub.restore();
    });
  });

});
