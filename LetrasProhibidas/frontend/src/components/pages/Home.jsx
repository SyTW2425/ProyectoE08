import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BentoItem } from "../assets/BentoItem";
import { useAuth } from "../hooks/useAuth";
import { JoinLobby } from "../JoinLobby";
import { useSocket } from "../hooks/useSocket";
import { StandardButton } from "../assets/StandardButton";

export const Home = ({ }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket, isConnected, connectSocket } = useSocket()
  const userID = localStorage.getItem("userID")
  const userName = localStorage.getItem("userName")
  const userAvatar = localStorage.getItem("userAvatar")

  const handleCreateLobby = async () => {
    if (!isConnected) {
      console.log("Socket no conectado, intentando reconectar...");
      connectSocket();
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/lobby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "hostID": userID,
          "players": [],
          "maxPlayers": 4
        })
      })
      const data = await response.json()
      const lobbyID = data.lobbyID
      navigate(`/lobby/${lobbyID}`)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!isConnected) {
      console.log("Esperando a que el socket se conecte...");
      connectSocket();
    }
  }, [isConnected, connectSocket]);

  return (
    <div>
      <div>
        <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
          <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
          <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
            <div className="flex h-full w-full items-center justify-center">
              <div className="grid h-full w-full gap-4 p-2 grid-cols-5 grid-rows-4 rounded-lg shadow-md">
                <div className="col-span-2 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                  <BentoItem title="PERFIL" description="Echa un vistazo a tus partidas ganadas, estadísticas y logros." background="bento/profile.webp" onClick={() => navigate("/profile")} />
                </div>
                <div className="col-span-3 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                  <BentoItem title="JUGAR" description="¿No tienes con quién jugar? No hay problema, busca una partida y conoce gente nueva." background="bento/play.webp" onClick={() => navigate("/play")} />
                </div>
                <div className="col-span-3 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                  <BentoItem title="UNIRSE" description="Pide a tus amigos el código de la sala y juega junto a ellos." background="bento/join.webp" onClick={() => setIsModalOpen(true)} />
                </div>
                <div className="col-span-2 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                  <BentoItem title="CREAR SALA" description="Crea una sala con tus propias reglas, ¡no te olvides de invitar a tus amigos!" background="bento/create.webp" onClick={() => handleCreateLobby()} />
                </div>
              </div>
            </div>
          </div>
          <StandardButton text="Logout" onClick={logout} />
          <JoinLobby isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Introduce Código" />
        </div>
      </div>
    </div>
  )
}