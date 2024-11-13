import { model, Schema } from "mongoose";

const LobbySchema = new Schema({
  id: { type: String, required: true },
  hostID: { type: String, required: true },
  players: { type: Array, required: true },
  maxPlayers: { type: Number, max: 4, required: true },
  createdAt: { type: Date, required: true },
});

export const Lobby = new model("Lobby", LobbySchema);