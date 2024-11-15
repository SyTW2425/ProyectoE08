import express from "express";

export const defaultRouter = express.Router();

defaultRouter.all("*", (_, res) => {
  res.status(501).send("Connected");
});

defaultRouter.all("*", (_, res) => {
  res.send("Hello, API is up and running");
});