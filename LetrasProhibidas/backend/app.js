import express from "express";
import "./db/config.js";
import { gameRouter } from "./routes/game.js";
import { userRouter } from "./routes/user.js";
import { lobbyRouter } from "./routes/lobby.js";

export const app = express();

app.use(express.json);

app.use(userRouter);
app.use(gameRouter);
app.use(lobbyRouter);

