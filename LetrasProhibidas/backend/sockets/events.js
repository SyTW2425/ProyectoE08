import { io } from "../app.js"

io.on("connection", (socket) => {
  console.log("me conecte");
})