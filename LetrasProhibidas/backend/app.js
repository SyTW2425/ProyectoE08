import express from "express";
import "./db/config.js";

export const app = express();

app.use(express.json);

