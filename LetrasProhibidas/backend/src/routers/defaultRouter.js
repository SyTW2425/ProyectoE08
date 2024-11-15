import express from "express";
import { fileURLToPath } from "url";
import path from "path";

export const defaultRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

defaultRouter.use(express.static(path.join(__dirname, "../../../frontend/build")));

defaultRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/build", "index.html"));
});

defaultRouter.all("*", (_, res) => {
  res.status(501).send("Not implemented");
});