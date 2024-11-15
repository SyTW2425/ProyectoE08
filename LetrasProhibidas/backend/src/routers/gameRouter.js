import express from "express";
import { GameServices } from "../services/gameServices.js"

export const gameRouter = express.Router();

// Conseguir la instancia de GameServices, si  no existe, se crea.
const gameService = GameServices.getInstance()

// EJ: http://localhost:5000/game?id=1234
gameRouter.get("/game", (req, res) => {
  const id = req.query.id;
  gameService.getGameById(id).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Game not found");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// EJ: http://localhost:5000/game/673774152c8491836a6aa153 (GET)
gameRouter.get("/game/:id", (req, res) => {
  const id = req.params.id;
  gameService.getGameByMongoId(id).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Game not found");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

gameRouter.post("/game", (req, res) => {
  const id = req.body.lobbyID;
  const players = req.body.players;
  gameService.createGame(id, players).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Could not create game");
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// EJ: http://localhost:5000/game?id=1234&winner=345 (UPDATE)
gameRouter.patch("/game", (req, res) => {
  const id = req.query.id;
  const winnerID = req.query.winnerID;
  gameService.updateGameWinner(id, winner).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Could not update");
  }).catch((err) => {
    res.status(400).send(err);
  });
})

gameRouter.delete("/game", (req, res) => {
  const id = req.query.id;
  gameService.deleteGame(id).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Could not delete the game");
  }).catch((err) => {
    res.status(400).send(err);
  })
})

gameRouter.delete("/game/:id", (req, res) => {
  const id = req.params.id;
  gameService.deleteGameByMongoId(id).then((game) => {
    return game ? res.status(200).send(game) : res.status(400).send("Could not delete the game");
  }).catch((err) => {
    res.status(400).send(err);
  })
})
