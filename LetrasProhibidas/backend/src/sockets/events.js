import { io } from "../app.js"
import { LobbyServices } from "../services/lobbyServices.js";

const lobbyService = LobbyServices.getInstance();

io.on("connection", (socket) => {
  console.log("me conecte");

  socket.on("joinLobby", ({ lobbyID, userID, userName, userAvatar }) => joinLobby(lobbyID, userID, userName, userAvatar))
  socket.on("leaveLobby", ({ lobbyID, userID }) => leaveLobby(lobbyID, userID))
  socket.on("sendMessage", ({ message, lobbyID }) => sendMessage(message, lobbyID))


  
  // Implementación de los eventos
  // Unirse a lobby
  const joinLobby = async (lobbyID, userID, userName, userAvatar) => {
    try {
      await lobbyService.addPlayerToLobby(lobbyID, {userID, userName, userAvatar})
      socket.join(lobbyID) // Une a la lobby al usuario
      console.log(socket.rooms)
      console.log(`El usuario ${userID} se ha unido a la lobby: ${lobbyID}`)
      io.to(lobbyID).emit("userUpdate")
    } catch(err) {
      console.log(err)
    }
  }

  // Dejar lobby
  const leaveLobby = async (lobbyID, userID) => {
    try {
      // 1. Eliminarme de la base de datos
      await lobbyService.removePlayerFromLobby(lobbyID, userID)
      // 2. Emitir evento de que me fui
      socket.to(lobbyID).emit("userUpdate")
      console.log("Emitiendo user update por el usuario", userID)
      // 3. Quitarme del grupo de la lobby
      socket.leave(lobbyID)
    } catch (err) {
      console.log(err)
    }


    socket.join(lobbyID) // Une a la lobby al usuario
    console.log(socket.rooms)
    console.log(`El usuario ${userID} se ha unido a la lobby: ${lobbyID}`)
    io.to(lobbyID).emit("newUser", { userID })
  }

  // Envío de mensajes
  const sendMessage = (message, lobbyID) => {
    console.log(socket.rooms)
    console.log(lobbyID)
    socket.to(lobbyID).emit("newMessage", { message })
    console.log("Emitiendo mensaje: ", message)
  }
})


