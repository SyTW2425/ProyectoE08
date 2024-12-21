/**
 * Archivo para poblar la base de datos con datos de prueba
 */

import mongoose from "mongoose";

// Importar los servicios de la base de datos
import { UserServices } from "../../services/userServices.js";
import { LobbyServices } from "../../services/lobbyServices.js";
import { GameServices } from "../../services/gameServices.js";

// Importar los modelos
import { User } from "../../models/user.js";
import { Lobby } from "../../models/lobby.js";
import { Game } from "../../models/game.js";
import dotenv from "dotenv";

// Conectar a la base de datos
dotenv.config();

mongoose.connect(process.env.MONGODB_URI_TEST);

// Crear los servicios
const userService = UserServices.getInstance();
const lobbyService = LobbyServices.getInstance();
const gameService = GameServices.getInstance();

// Crear usuarios de prueba
const testUsers = [
  {
    email: "user1@example.com",
    name: "User One",
    password: "Password123!",
    avatarSrc: "https://example.com/avatar1.png",
    id: "7e1e6b3c-3e3a-46ac-a4ad-49ee65778517",
  },
  {
    email: "user2@example.com",
    name: "User Two",
    password: "Password123!",
    avatarSrc: "https://example.com/avatar2.png",
    id: "050c2491-41aa-4e0c-a2f2-ad1184884c63",
  },
  {
    email: "user3@example.com",
    name: "User Three",
    password: "Password123!",
    avatarSrc: "https://example.com/avatar3.png",
    id: "89c01e99-325a-41fc-8a73-843fb04800c7",
  },
];

async function seedUsers() {
  await User.deleteMany({});
  for (const userData of testUsers) {
    const user = new User(userData);
    await user.save();
  }
}

// Crear lobbies de prueba
const testLobbies = [
  {
    lobbyID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
    hostID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
    players: ["b1a1c1d1-e1f1-1234-5678-9abcdef01234"],
    maxPlayers: 4,
  },
  {
    lobbyID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
    hostID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
    players: [
      "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
      "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
    ],
    maxPlayers: 4,
  },
  {
    lobbyID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
    hostID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
    players: ["b3a3c3d3-e3f3-1234-5678-9abcdef01234"],
    maxPlayers: 4,
  },
];

async function seedLobbies() {
  await Lobby.deleteMany({});
  for (const lobbyData of testLobbies) {
    const lobby = new Lobby(lobbyData);
    await lobby.save();
  }
}

// Crear juegos de prueba
const testGames = [
  {
    gameID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
    players: [
      "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
      "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
    ],
    winnerID: "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
  },
  {
    gameID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
    players: [
      "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
      "b1a1c1d1-e1f1-1234-5678-9abcdef01234",
    ],
    winnerID: "b2a2c2d2-e2f2-1234-5678-9abcdef01234",
  },
  {
    gameID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
    players: ["b3a3c3d3-e3f3-1234-5678-9abcdef01234"],
    winnerID: "b3a3c3d3-e3f3-1234-5678-9abcdef01234",
  },
];

async function seedGames() {
  await Game.deleteMany({});
  for (const gameData of testGames) {
    const game = new Game(gameData);
    await game.save();
  }
}

mongoose.connection.once("open", async () => {
  try {
    await seedUsers();
    console.log("Test users created successfully");

    await seedLobbies();
    console.log("Test lobbies created successfully");

    await seedGames();
    console.log("Test games created successfully");
  } catch (err) {
    console.error("Error creating test data:", err);
  } finally {
    mongoose.connection.close();
  }
});
