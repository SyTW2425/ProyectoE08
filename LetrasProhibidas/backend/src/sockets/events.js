import { io } from "../app.js"
import { LobbyServices } from "../services/lobbyServices.js";

const lobbyService = LobbyServices.getInstance();

io.on("connection", (socket) => {
  console.log("me conecte");

  socket.on("joinLobby", ({ lobbyID, userID, userName, userAvatar }) => joinLobby(lobbyID, userID, userName, userAvatar))


  
  // Implementación de los eventos
  const joinLobby = async (lobbyID, userID, userName, userAvatar) => {
    socket.join(lobbyID) // Une a la lobby al usuario
    console.log(`El usuario ${userID} se ha unido a la lobby: ${lobbyID}`)
    await lobbyService.addPlayerToLobby(lobbyID, {userID, userName, userAvatar})
    io.to(lobbyID).emit("newUser", { userID })
  }
})


