import express from "express";
import { gameRouter } from "./routers/gameRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { lobbyRouter } from "./routers/lobbyRouter.js";
import { defaultRouter } from "./routers/defaultRouter.js";
import "./db/configTest.js";

export const app = express();

app.use(express.json());

app.use(userRouter);
app.use(gameRouter);
app.use(lobbyRouter);
app.use(defaultRouter);

export default app;
