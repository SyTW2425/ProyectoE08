import { Schema, model } from "mongoose";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

const GameSchema = new Schema({
  gameID: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
    validate: {
      validator: (value) => validator.isUUID(value),
      message: "Invalid ID",
    },
  },
  lobbyID: {
    type: String,
    required: true,
      default: uuidv4,
      validate: {
        validator: (value) => validator.isUUID(value),
        message: "Invalid ID",
      },
  },
  players: {
    type: Array,
    required: true,
  },
  winnerID: {
    type: String,
    validate: {
      validator: (value) => validator.isUUID(value),
      message: "Invalid ID",
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const Game = model("Game", GameSchema);
