import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "./db/config.js";
import { gameRouter } from "./routers/gameRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { lobbyRouter } from "./routers/lobbyRouter.js";
import { defaultRouter } from "./routers/defaultRouter.js";
import cors from "cors";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());

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
