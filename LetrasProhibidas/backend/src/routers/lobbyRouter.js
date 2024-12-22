import express from "express";
import { LobbyServices } from "../services/lobbyServices.js";

export const lobbyRouter = express.Router();
const lobbyService = LobbyServices.getInstance();

lobbyRouter.get("/lobby", (req, res) => {
  const lobbyID = req.query.lobbyID;

  if (!lobbyID) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .getLobbyById(lobbyID)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Lobby no encontrado");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener el lobby por su ID");
    });
});

lobbyRouter.get("/lobby/all", (_, res) => {
  lobbyService
    .getAllLobbies()
    .then((lobbies) => {
      return lobbies
        ? res.status(200).send(lobbies)
        : res.status(404).send("Lobby no encontrado");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener todos los lobbies");
    });
});

lobbyRouter.post("/lobby", (req, res) => {
  const hostID = req.body.hostID;
  const players = req.body.players;
  const maxPlayers = req.body.maxPlayers;

  if (!hostID || !players || !maxPlayers) {
    return res.status(400).send("Missing parameters");
  }

  lobbyService
    .createLobby(hostID, players, maxPlayers)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("No se pudo crear el lobby");
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Error al intentar crear el lobby");
    });
});

lobbyRouter.patch("/lobby", (req, res) => {
  const lobbyID = req.query.lobbyID;
  const players = req.body.players;

  if (!lobbyID || !players) {
    return res.status(400).send("No se proporcionó el ID o los jugadores");
  }

  lobbyService
    .updateLobbyPlayers(lobbyID, players)
    .then((lobby) => {
      return lobby
        ? res.status(200).send("Lobby actualizado correctamente")
        : res.status(404).send("No se pudo actualizar el lobby");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar actualizar el lobby");
    });
});

lobbyRouter.delete("/lobby", (req, res) => {
  const lobbyID = req.query.lobbyID;

  if (!lobbyID) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .deleteLobby(lobbyID)
    .then((result) => {
      return result.deletedCount > 0
        ? res.status(200).send("Lobby eliminado correctamente")
        : res.status(404).send("No se pudo eliminar");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar eliminar el lobby");
    });
});

lobbyRouter.get("/lobby/status", async (req, res) => {
  const lobbyID = req.body.lobbyID;
  if (!lobbyID) {
    return res.status(400).send("No se proporcionó el ID del lobby");
  }
  try {
    const lobbyStatus = await lobbyService.getLobbyStatus(lobbyID);
    res.status(200).send(lobbyStatus);
  } catch (err) {
    res.status(400).send("Error fetching status");
  }
});

lobbyRouter.patch("/lobby/status", async (req, res) => {
  const lobbyID = req.body.lobbyID;
  const lobbyStatus = req.body.lobbyStatus;
  try {
    const lobby = await lobbyService.getLobbyById(lobbyID);
    if (!lobby) {
      return res.status(404).send("Lobby no encontrado");
    }
    lobby.joinable = lobbyStatus;
    await lobby.save();
    res.status(200).send("Estado actualizado correctamente");
  } catch (err) {
    res.status(400).send("Error updating status");
  }
});
