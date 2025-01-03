import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState, useCallback } from "react"
import { Timer } from "../assets/Timer"
import { GameInput } from "../assets/GameInput"
import { UserCarousel } from "../assets/UserCarousel"
import { StandardButton } from "../assets/StandardButton"
import { EndPage } from "./EndPage"
import { WinnerPage } from "./WinnerPage"
import { Loader } from "../assets/Loader"

export const Game = () => {
  const { id } = useParams()
  const { socket } = useSocket()
  const userID = localStorage.getItem("userID")
  const navigate = useNavigate()
  const [players, setPlayers] = useState(null) // Jugadores que estan en la partida y las vidas que tienen
  const [forbiddenLetters, setForbidenLetters] = useState([])
  const [turn, setTurn] = useState() // El ID del jugador al que le toca
  const [category, setCategory] = useState(null)
  const [guessTries, setGuessTries] = useState([])
  const [resetTimer, setResetTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20) // Tiempo restante
  const [gameEnded, setGameEnded] = useState(false)
  const [winnerID, setWinnerID] = useState(null)
  const lobbyID = localStorage.getItem("lobbyID")

  const handlePlayerUpdate = () => {
    console.log("actualizando jugadores")
    fetchGameData()
  }

  const handleNewLetter = (newLetter) => {
    setForbidenLetters((prevLetters) => [...prevLetters, newLetter])
  }

  const handleNewCategory = (newCategory) => {
    setCategory(newCategory)
  }

  const fetchGameData = useCallback(async () => {
    try {
      console.log("jecutpo")
      const response = await fetch(`http://localhost:5000/game?gameID=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const newPlayers = data.players.map(player => ({ ...player, lives: 3 }));
      console.log(newPlayers)
      setPlayers(newPlayers);
      console.log("LA LOBBY ES:" + id)
    } catch (err) {
      console.error("Error fetching lobby data:", err);
    }
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinedGame", { gameID: id })
      socket.on("playerUpdate", () => handlePlayerUpdate());
      socket.on("newLetter", ({ newLetter }) => handleNewLetter(newLetter));
      socket.on("newCategory", ({ newCategory }) => handleNewCategory(newCategory));
      socket.on("guessTry", ({ userID, word, isCorrect }) => handleNewGuessTry(userID, word, isCorrect));
      socket.on("turnUpdate", ({ currentTurn }) => {
        setTurn(currentTurn)
        console.log("turno actualizado");
        console.log(currentTurn);
      })
      socket.on("lifeUpdate", ({ userID, lives }) => handleLifeUpdate(userID, lives));
      socket.on("playerEliminated", ({ userID }) => handlePlayerEliminated(userID));
      socket.on("resetTimer", () => {
        console.log("resetTimer")
        setResetTimer(prev => !prev)
      });
      socket.on("updateTimer", ({ timeLeft }) => {
        setTimeLeft(timeLeft);
      });
      socket.on("gameEnded", () => {
        console.log("Partida finalizada");
        setGameEnded(true);
      });
      socket.on("gameWon", ({ winnerID }) => {
        console.log(`El usuario ${winnerID} ha ganado la partida`);
        setWinnerID(winnerID);
      });
    }
    fetchGameData();

    return () => {
      if (socket) {
        socket.off("playerUpdate");
        socket.off("newLetter")
        socket.off("newCategory")
        socket.off("guessTry")
        socket.off("turnUpdate")
        socket.off("lifeUpdate")
        socket.off("playerEliminated")
        socket.off("resetTimer")
        socket.off("updateTimer")
        socket.off("gameEnded")
        socket.off("gameWon")
      }
    };
  }, [fetchGameData, socket]);

  const handleStart = () => {
    socket.emit("requestStart", { gameID: id })
  }

  const handleSendWord = (word) => {
    if (turn === userID) {
      // Enviamos la primera palabra de la frase, por lo que lo modificamos
      word = word.split(" ")[0];
      socket.emit("sendWord", { gameID: id, userID, word, category });
    } else {
      console.log("No es tu turno");
    }
  }

  const handleNewGuessTry = (userID, word, isCorrect) => {
    const newGuessTry = { userID, word, isCorrect }
    setGuessTries((prevTries) => [...prevTries, newGuessTry])
    console.log("ejecuto handleNewGuessTry")

    setTimeout(() => {
      setGuessTries((prevTries) => prevTries.filter((t) => t !== newGuessTry))
    }, 3000)
  }

  const handleLifeUpdate = (userID, lives) => {
    console.log(`Actualizando vidas para el usuario ${userID}: ${lives}`);
    setPlayers(prevPlayers => prevPlayers.map(player => player.userID === userID ? { ...player, lives } : player));
    console.log("vidas actualizadas " + lives)
  }

  const handlePlayerEliminated = (userID) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.userID !== userID));
  }

  if (winnerID === userID) {
    return <WinnerPage lobbyID={lobbyID} />; // Renderizar WinnerPage si el usuario ha ganado
  }

  if (gameEnded) {
    return <EndPage lobbyID={lobbyID} />; // Renderizar EndPage si la partida ha terminado
  }

  return (
    <div>
      {
        players ? (
          <div>
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-center shadow-xl font-poppins text-white">
              {
                forbiddenLetters.length && category ? (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-black p-2">
                      <span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS:  </span>
                      {forbiddenLetters.join(", ")}
                    </h1>
                    <Timer className="p-2" timeLeft={timeLeft} />
                    <p className="p-2 text-2xl font-bold">CATEGORÍA: {category.toUpperCase()}</p>
                    <GameInput handleSend={(word) => handleSendWord(word)} disabled={turn !== userID} />
                    <UserCarousel players={players} turn={turn} guessTries={guessTries} />
                    <div className="flex pt-2">
                      <StandardButton text="Salir" onClick={() => navigate("/")} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[64px] font-black"><span className="text-white">¿ESTÁN</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">LISTOS?</span></h1>
                    <UserCarousel players={players} turn={turn} guessTries={guessTries} />
                    <div className="flex gap-2">
                      <StandardButton text="Empezar" onClick={() => handleStart()} />
                      <StandardButton text="Salir" onClick={() => navigate("/")} />
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        ) : (
          <Loader />
        )
      }
    </div>
  )
}