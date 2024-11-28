import express from "express";
import { LobbyServices } from "../services/lobbyServices.js";

export const lobbyRouter = express.Router();
const lobbyService = LobbyServices.getInstance();

lobbyRouter.get("/lobby", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("No id provided");
  }

  lobbyService
    .getLobbyById(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Lobby not found");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.get("/lobby/all", (_, res) => {
  lobbyService
    .getAllLobbies()
    .then((lobbies) => {
      return lobbies
        ? res.status(200).send(lobbies)
        : res.status(404).send("Lobbies not found");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.get("/lobby/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No id provided");
  }

  lobbyService
    .getLobbyByMongoId(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Lobby not found");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.get("/lobby/all/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No id provided");
  }

  lobbyService
    .getAllUserLobbies(id)
    .then((lobbies) => {
      return lobbies
        ? res.status(200).send(lobbies)
        : res.status(404).send("Could not get lobbies");
    })
    .catch((err) => {
      res.status(500).send(err);
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
        : res.status(404).send("Could not create lobby");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.patch("/lobby", (req, res) => {
  const id = req.query.id;
  const players = req.body.players;

  if (!id || !players) {
    return res.status(400).send("Missing parameters");
  }

  lobbyService
    .updateLobbyPlayers(id, players)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Could not update");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.delete("/lobby", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("No id provided");
  }

  lobbyService
    .deleteLobby(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Could not update");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

lobbyRouter.delete("/lobby/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No id provided");
  }

  lobbyService
    .deleteLobbyByMongoId(id)
    .then((lobby) => {
      return lobby
        ? res.status(200).send(lobby)
        : res.status(404).send("Could not update");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
