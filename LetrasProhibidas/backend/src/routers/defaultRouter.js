import express from "express";
import { fileURLToPath } from "url";

export const defaultRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);

defaultRouter.all("*", (_, res) => {
  res.status(501).send("Not implemented");
});
