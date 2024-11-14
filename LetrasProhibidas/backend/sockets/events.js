import { io } from "../app.js"

io.on("connection", (socket) => {
  console.log(socket);
})