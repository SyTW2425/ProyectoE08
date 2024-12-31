import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState, useCallback } from "react"
import { Timer } from "../assets/Timer"
import { GameInput } from "../assets/GameInput"
import { UserCarousel } from "../assets/UserCarousel"
import { StandardButton } from "../assets/StandardButton"

export const Game = () => {
  const { id } = useParams()
  const { socket } = useSocket()
  const navigate = useNavigate()
  const [players, setPlayers] = useState(null) // Jugadores que estan en la partida y las vidas que tienen
  const [lives, setLives] = useState(3) // Mis vidas
  const [forbiddenLetters, setForbidenLetters] = useState(null)
  const [turn, setTurn] = useState() // El ID del jugador al que le toca
  const [category, setCategory] = useState("Frutas")
  // Evento para comprobar palabra
  // Evento para comprobar vidas
  // Evento para pasar de turno
  // Evento para 

  const handlePlayerUpdate = () => {
    console.log("actualizando jugadores")
    fetchGameData()
  }

  const handleNewLetter = (newLetter) => {
    if (forbiddenLetters) {
      setForbidenLetters((prevLetters) => [...prevLetters, newLetter])
    }
    else setForbidenLetters([newLetter])
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
        const newPlayers = data.players.map(player => ({...player, lives: 3 }));
        console.log(newPlayers)
        setPlayers(newPlayers);
      } catch (err) {
        console.error("Error fetching lobby data:", err);
      }
    }, [id]);
  
    useEffect(() => {
      if (socket) {
        socket.emit("joinedGame", { gameID: id })
        socket.on("playerUpdate", () => handlePlayerUpdate());
        socket.on("newLetter", ({newLetter}) => handleNewLetter(newLetter));
        socket.on("newCategory", ({newCategory}) => handleNewCategory(newCategory));
      }
      fetchGameData();

      return () => {
        if (socket) {
          socket.off("playerUpdate");
          socket.off("newLetter")
          socket.off("newCategory")
        }
      };
    }, [fetchGameData, socket]);

    const handleStart = () => {
      socket.emit("requestStart", { gameID: id, currentLetters: forbiddenLetters })
    }
  
  return (
    <div>
      {
        players ? (
          <div>
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-center shadow-xl font-poppins text-white">
              {
                forbiddenLetters ? (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-black p-2"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS: </span>{JSON.stringify(forbiddenLetters)}</h1>
                    <Timer className="p-2"/>
                    <p className="p-2 text-2xl font-bold">CATEGORÍA: {category.toUpperCase()}</p>
                    <GameInput/>
                    <UserCarousel players={players} turn={turn}/>
                    <div className="flex gap-2">
                      <StandardButton text="Salir" onClick={() => navigate("/")}/>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <UserCarousel players={players} turn={turn}/>
                    <div className="flex gap-2">
                      <StandardButton text="Empezar" onClick={() => handleStart()}/>
                      <StandardButton text="Salir" onClick={() => navigate("/")}/>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )
      }
    </div>
  )
}