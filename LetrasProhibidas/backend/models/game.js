import { model, Schema } from "mongoose";

const GameSchema = new Schema({
  id: { type: String, required: true },
  lobbyID: { type: String, required: true },
  players: { type: Array, required: true},
  winnerID: { type: String },
  createdAt: { type: Date, required: true },
});

export const Game = new model("Game", GameSchema);