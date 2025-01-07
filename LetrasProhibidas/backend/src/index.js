import { httpServer } from "./app.js";
import "./sockets/events.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log("Server listening on PORT", port);
});