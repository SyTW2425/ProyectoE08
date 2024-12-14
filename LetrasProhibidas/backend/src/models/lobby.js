import { model, Schema } from "mongoose";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

const LobbySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
    validate: {
      validator: (value) => validator.isUUID(value),
      message: "Invalid ID",
    },
  },
  hostID: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isUUID(value),
      message: "Invalid ID",
    },
  },
  players: {
    type: Array,
    required: true,
  },
  maxPlayers: {
    type: Number,
    max: 4,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  joinable: {
    type: Boolean,
    required: true,
    default: true
  }
});

export const Lobby = model("Lobby", LobbySchema);
