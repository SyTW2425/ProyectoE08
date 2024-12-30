import express from "express";
import { GameServices } from "../services/gameServices.js";

export const gameRouter = express.Router();

// Conseguir la instancia de GameServices, si no existe, se crea.
const gameService = GameServices.getInstance();

// EJ: http://localhost:5000/game?id=1234
gameRouter.get("/game", (req, res) => {
  const gameID = req.query.gameID;
  if (!gameID) {
    return res.status(400).send("No se proporcionó el ID del juego");
  }

  gameService
    .getGameByGameID(gameID)
    .then((game) => {
      return game
        ? res.status(200).send(game)
        : res.status(404).send("Juego no encontrado");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar obtener el juego por su ID");
    });
});

gameRouter.post("/game", (req, res) => {
  const { players, lobbyID } = req.body;

  if (!players) {
    return res
      .status(400)
      .send("No se proporcionó el ID del lobby, jugadores o ganador");
  }

  gameService
    .createGame(players, lobbyID)
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
  const gameID = req.query.gameID;
  const winnerID = req.query.winnerID;

  if (!gameID || !winnerID) {
    return res.status(400).send("No se proporcionó el ID o el ganador");
  }
  gameService
    .updateGameWinner(gameID, winnerID)
    .then((result) => {
      return result.modifiedCount > 0
        ? res.status(200).send("Ganador actualizado correctamente")
        : res.status(404).send("No se pudo actualizar el ganador del juego");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar actualizar el ganador del juego");
    });
});

gameRouter.delete("/game", (req, res) => {
  const gameID = req.query.gameID;

  if (!gameID) {
    return res.status(400).send("No se proporcionó el ID");
  }

  gameService
    .deleteGame(gameID)
    .then((result) => {
      return result.deletedCount > 0
        ? res.status(200).send("Juego eliminado correctamente")
        : res.status(404).send("No se pudo eliminar el juego");
    })
    .catch((err) => {
      res.status(500).send("Error al intentar eliminar el juego");
    });
});
