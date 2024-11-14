import express from "express";
import { createServer } from "http"
import { Server } from "socket.io"
import "./db/config.js";
import { gameRouter } from "./routes/game.js";
import { userRouter } from "./routes/user.js";
import { lobbyRouter } from "./routes/lobby.js";
import { defaultRouter } from "./routes/default.js";

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(userRouter);
app.use(gameRouter);
app.use(lobbyRouter);
app.use(defaultRouter);

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});