import { io } from "../app.js"
import { GameServices } from "../services/gameServices.js";
import { LobbyServices } from "../services/lobbyServices.js";
import { checkWord } from "../utils/checkWord.js";
import { getRandomCategory } from "../utils/getRandomCategory.js";
import { getRandomLetter } from "../utils/getRandomLetter.js";
import { loadWords } from "../utils/loadWords.js";

const lobbyService = LobbyServices.getInstance();
const gameService = GameServices.getInstance();

let words = []

io.on("connection", (socket) => {
  console.log("me conecte");

  socket.on("joinLobby", ({ lobbyID, userID, userName, userAvatar }) => joinLobby(lobbyID, userID, userName, userAvatar))
  socket.on("leaveLobby", ({ lobbyID, userID }) => leaveLobby(lobbyID, userID))
  socket.on("sendMessage", ({ message, lobbyID }) => sendMessage(message, lobbyID))
  socket.on("creatingGame", ({gameID, userID, userName, userAvatar, lobbyID}) => creatingGame(gameID, userID, userName, userAvatar, lobbyID))
  socket.on("joinGame", ({ gameID, userID, userName, userAvatar }) => joinGame(gameID, userID, userName, userAvatar))
  socket.on("joinedGame", ({ gameID }) => joinedGame(gameID))
  socket.on("requestStart", ({ gameID }) => requestStart(gameID))
  socket.on("sendWord", ({ gameID, userID, word, category }) => sendWord(gameID, userID, word, category))


  
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
      // 1. Eliminarme de la base de datos, si soy el host, debo transferir el host a otro
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

  const creatingGame = async (gameID, userID, userName, userAvatar, lobbyID) => {
    console.log(`El usuario ${userID} ha creado el game: ${gameID}`)
    io.to(lobbyID).emit("startingGame", { gameID })
  }

  const joinGame = async (gameID, userID, userName, userAvatar) => {
    try {
      await gameService.addPlayerToGame({userID, userName, userAvatar}, gameID)
      socket.join(gameID) // Une a la room del Juego
      console.log(socket.rooms)
      console.log(`El usuario ${userID} se ha unido al game: ${gameID}`)
      socket.emit("joiningGame", { gameID })
    } catch(err) {
      console.log(err)
    }
  }

  const joinedGame = async (gameID) => {
    socket.to(gameID).emit("playerUpdate")
  }

  const requestStart = async (gameID) => {
    // Cargar en el backend las palabras
    words = loadWords()
    const newLetter = getRandomLetter()
    io.to(gameID).emit("newLetter", ({ newLetter }))
    const newCategory = getRandomCategory()
    io.to(gameID).emit("newCategory", ({ newCategory }))
  }

  const sendWord = async (gameID, userID,  word, category) => {
    // Emitir evento de que se intentó adivinar
    // Comprobar la palabra
    const isCorrect = checkWord(words, word, category)
    io.to(gameID).emit("guessTry", ({ userID, word, isCorrect }))
    if (isCorrect) {
      // Palabra acertada, emitir evento correspondiente.
      console.log("Acerto")
      io.to(gameID).emit("correctAnswer")
      // Manejar el cambio de turno???
    }
    else {
      // Palabra fallida, emitir evento correspondiente.
      console.log("Fallo")
      io.to(gameID).emit("wrongAnswer")
    }
  }
})


