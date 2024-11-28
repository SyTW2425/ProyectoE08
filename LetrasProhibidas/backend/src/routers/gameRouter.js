import express from "express";
import { GameServices } from "../services/gameServices.js";

export const gameRouter = express.Router();

// Conseguir la instancia de GameServices, si  no existe, se crea.
const gameService = GameServices.getInstance();

// EJ: http://localhost:5000/game?id=1234
gameRouter.get("/game", (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  gameService
    .getGameById(id)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("Juego no encontrado");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener el juego por su ID");
    });
});

// EJ: http://localhost:5000/game/673774152c8491836a6aa153 (GET)
gameRouter.get("/game/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID de MongoDB");
  }

  gameService
    .getGameByMongoId(id)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("No se encontró el juego por su ID de MongoDB");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Error al intentar obtener el juego por su ID de MongoDB");
    });
});

gameRouter.post("/game", (req, res) => {
  const id = req.body.lobbyID;
  const players = req.body.players;

  if (!id || !players) {
    return res
      .status(400)
      .send("No se proporcionó el ID del lobby o jugadores");
  }

  gameService
    .createGame(id, players)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("No se pudo crear el juego");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar crear el juego");
    });
});

// EJ: http://localhost:5000/game?id=1234&winner=345 (UPDATE)
gameRouter.patch("/game", (req, res) => {
  const id = req.query.id;
  const winnerID = req.query.winnerID;

  if (!id || !winnerID) {
    return res.status(400).send("No se proporcionó el ID o el ganador");
  }
  gameService
    .updateGameWinner(id, winnerID)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("No se pudo actualizar el ganador del juego");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar actualizar el ganador del juego");
    });
});

gameRouter.delete("/game", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("No se proporcionó el ID");
  }

  gameService
    .deleteGame(id)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("No se pudo eliminar el juego");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar eliminar el juego");
    });
});
