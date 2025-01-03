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
let gameTurns = {}
let timers = {}

const resetTimer = (gameID) => {
  if (timers[gameID]) {
    clearInterval(timers[gameID]);
  }

  let timeLeft = 20; // 20 segundos
  io.to(gameID).emit("updateTimer", { timeLeft });

  timers[gameID] = setInterval(() => {
    timeLeft -= 1;
    io.to(gameID).emit("updateTimer", { timeLeft });

    if (timeLeft < 0) {
      clearInterval(timers[gameID]);
      setTimeout(() => handleTimeOut(gameID), 1000); // Agregar un retraso de 1 segundo
    }
  }, 1000);
};

const rotateTurn = (gameID) => {
  const game = gameTurns[gameID];
  if (!game) return;

  if (game.players.length === 0) {
    console.log(`No quedan jugadores en la partida ${gameID}. Finalizando partida.`);
    endGame(gameID);
    return;
  }

  const currentTurnIndex = game.players.findIndex(player => player.userID === game.currentTurn);
  const nextTurnIndex = (currentTurnIndex + 1) % game.players.length;
  game.currentTurn = game.players[nextTurnIndex].userID;

  io.to(gameID).emit("turnUpdate", { currentTurn: game.currentTurn });
  resetTimer(gameID);
};

const checkForWinner = (gameID) => {
  const game = gameTurns[gameID];
  if (!game) return;

  const remainingPlayers = game.players.filter(player => player.lives > 0);
  if (remainingPlayers.length === 1) {
    const winner = remainingPlayers[0];
    io.to(gameID).emit("gameWon", { winnerID: winner.userID });
    console.log(`El usuario ${winner.userID} ha ganado la partida ${gameID}`);
    endGame(gameID);
  }
};

const handleLifeLoss = (gameID, userID) => {
  const game = gameTurns[gameID];
  const player = game.players.find(player => player.userID === userID);
  if (player) {
    player.lives = Math.max(player.lives - 1, 0); // Ensure lives do not go below 0
    if (player.lives <= 0) {
      game.players = game.players.filter(p => p.userID !== userID);
    }
    io.to(gameID).emit("lifeUpdate", { userID, lives: player.lives });
    console.log("Vidas actualizadas", player.lives);
    checkForWinner(gameID);
  }
};

const changeCategory = (gameID) => {
  const newCategory = getRandomCategory();
  io.to(gameID).emit("newCategory", { newCategory });
};

const endGame = (gameID) => {
  if (timers[gameID]) {
    clearInterval(timers[gameID]);
    delete timers[gameID];
  }
  if (gameTurns[gameID]) {
    delete gameTurns[gameID];
  }
  io.to(gameID).emit("gameEnded");
  console.log(`Partida ${gameID} finalizada.`);
  // lobbyService.setLobbyStatus(gameID, true);
};

const handleTimeOut = (gameID) => {
  const game = gameTurns[gameID];
  if (!game) {
    console.error(`No se encontró el juego con ID ${gameID}`);
    return;
  }
  const currentTurn = game.currentTurn;
  console.log(`Tiempo agotado para el usuario ${currentTurn}`);
  handleLifeLoss(gameID, currentTurn);
  rotateTurn(gameID);
  changeCategory(gameID);
  resetTimer(gameID); // Reiniciar el temporizador después de manejar el tiempo agotado
};



io.on("connection", (socket) => {
  console.log("me conecte");

  socket.on("joinLobby", ({ lobbyID, userID, userName, userAvatar }) => joinLobby(lobbyID, userID, userName, userAvatar))
  socket.on("leaveLobby", ({ lobbyID, userID }) => leaveLobby(lobbyID, userID))
  socket.on("sendMessage", ({ message, lobbyID }) => sendMessage(message, lobbyID))
  socket.on("creatingGame", ({ gameID, userID, userName, userAvatar, lobbyID }) => creatingGame(gameID, userID, userName, userAvatar, lobbyID))
  socket.on("joinGame", ({ gameID, userID, userName, userAvatar }) => joinGame(gameID, userID, userName, userAvatar))
  socket.on("joinedGame", ({ gameID }) => joinedGame(gameID))
  socket.on("requestStart", ({ gameID }) => requestStart(gameID))
  socket.on("sendWord", ({ gameID, userID, word, category }) => sendWord(gameID, userID, word, category))

  // Implementación de los eventos
  // Unirse a lobby
  const joinLobby = async (lobbyID, userID, userName, userAvatar) => {
    try {
      const lobby = await lobbyService.getLobbyById(lobbyID);
      if (!lobby) {
        throw new Error(`Lobby with ID ${lobbyID} not found`);
      }
      await lobbyService.addPlayerToLobby(lobbyID, { userID, userName, userAvatar });
      socket.join(lobbyID); // Une a la lobby al usuario
      console.log(`El usuario ${userID} se ha unido a la lobby: ${lobbyID}`);
      io.to(lobbyID).emit("userUpdate");
    } catch (err) {
      console.log(err);
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
      await gameService.addPlayerToGame({ userID, userName, userAvatar }, gameID)
      socket.join(gameID) // Une a la room del Juego
      console.log(socket.rooms)
      console.log(`El usuario ${userID} se ha unido al game: ${gameID}`)
      socket.emit("joiningGame", { gameID })
    } catch (err) {
      console.log(err)
    }
  }

  const joinedGame = async (gameID) => {
    socket.to(gameID).emit("playerUpdate")
  }

  const requestStart = async (gameID) => {
    words = loadWords();
    const newLetter = getRandomLetter();
    const newCategory = getRandomCategory();

    const game = await gameService.getGameByGameID(gameID);
    gameTurns[gameID] = {
      players: game.players.map(player => ({ ...player, lives: 3 })), // Inicializar con 3 vidas
      currentTurn: game.players[0].userID // Inicializar con el primer jugador
    };

    io.to(gameID).emit("newLetter", { newLetter });
    io.to(gameID).emit("newCategory", { newCategory });
    io.to(gameID).emit("turnUpdate", { currentTurn: gameTurns[gameID].currentTurn });
    resetTimer(gameID);
  };

  const sendWord = async (gameID, userID, word, category) => {
    const isCorrect = checkWord(words, word, category);
    io.to(gameID).emit("guessTry", { userID, word, isCorrect });

    if (isCorrect) {
      console.log("Acertó");
      io.to(gameID).emit("correctAnswer");

      // Cambiar la categoría
      const newCategory = getRandomCategory();
      io.to(gameID).emit("newCategory", { newCategory });

      // Reiniciar el contador
      resetTimer(gameID);

      // Rotar el turno
      rotateTurn(gameID);
    } else {
      console.log("Falló");
      io.to(gameID).emit("wrongAnswer");
      handleLifeLoss(gameID, userID);
      changeCategory(gameID);
      rotateTurn(gameID);
    }
  };
})