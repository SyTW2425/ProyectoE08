import express from "express";
import { LobbyServices } from "../services/lobbyServices.js";

export const lobbyRouter = express.Router();
const lobbyService = LobbyServices.getInstance();

lobbyRouter.get("/lobby", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .getLobbyById(id)
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

lobbyRouter.get("/lobby/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .getLobbyByMongoId(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Lobby no encontrado");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Error al intentar obtener el lobby por su ID de MongoDB");
    });
});

lobbyRouter.get("/lobby/all/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .getAllUserLobbies(id)
    .then((lobbies) => {
      return lobbies
        ? res.status(200).send(lobbies)
        : res.status(404).send("No se pudieron obtener los lobbies");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener los lobbies del usuario");
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
      res.status(500).send("Error al intentar crear el lobby");
    });
});

lobbyRouter.patch("/lobby", (req, res) => {
  const id = req.query.id;
  const players = req.body.players;

  if (!id || !players) {
    return res.status(400).send("No se proporcionó el ID o los jugadores");
  }

  lobbyService
    .updateLobbyPlayers(id, players)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("No se pudo actualizar el lobby");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar actualizar el lobby");
    });
});

lobbyRouter.delete("/lobby", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .deleteLobby(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("No se pudo eliminar");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar eliminar el lobby");
    });
});

lobbyRouter.delete("/lobby/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  lobbyService
    .deleteLobbyByMongoId(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res
            .status(404)
            .send("No se pudo eliminar el lobby por su ID de MongoDB");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Error al intentar eliminar el lobby por su ID de MongoDB");
    });
});
