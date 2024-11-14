import express from "express";
import { createServer } from "http"
import { Server } from "socket.io"
import "./db/config.js";
import { gameRouter } from "./routes/game.js";
import { userRouter } from "./routes/user.js";
import { lobbyRouter } from "./routes/lobby.js";

export const app = express();
export const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json);

app.use(userRouter);
app.use(gameRouter);
app.use(lobbyRouter);

