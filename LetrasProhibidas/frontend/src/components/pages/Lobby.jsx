import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState, useCallback } from "react"
import { LobbyChat } from "../LobbyChat"
import { CopyToClipboard } from "../assets/CopyToClipboard"

export const Lobby = () => {
  const { id } = useParams()
  const { socket } = useSocket()
  const [users, setUsers] = useState(null)
  const [numPlayers, setNumPlayers] = useState(0)
  const [maxPlayers, setMaxPlayers] = useState(0)
  const [loading, setLoading] = useState(true)
  const userName = localStorage.getItem("userName")
  const userID = localStorage.getItem("userID")
  const navigate = useNavigate()

  const handleUserUpdate = () => {
    console.log("Actualizando lista de jugadores")
    fetchLobbyData()
  };

  const handleLeave = (userID) => {
    socket.emit("leaveLobby", ({lobbyID: id, userID}))
    navigate("/")
  }

  const fetchLobbyData = useCallback(async () => {
    console.log("ejecuto");
    try {
      const response = await fetch(`http://localhost:5000/lobby?lobbyID=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data.players);
      setNumPlayers(data.players.length)
      setMaxPlayers(data.maxPlayers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lobby data:", err);
    }
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on("userUpdate", () => handleUserUpdate());
    }

    return () => {
      if (socket) {
        socket.off("userUpdate"); // Importantisimo
      }
    };
  }, [fetchLobbyData, socket]);

  return (
    <div>
      <div>
        <div>
          <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
            <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
            <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
              <div className="flex h-full w-full gap-36">
                <div>
                  <h2 className="font-black text-2xl bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">JUGADORES {`(${numPlayers}/${maxPlayers})`}</h2>
                  {users ? (
                    users.map(user => (
                      <div key={user.userID} className="flex flex-row items-center gap-4 m-4">
                        <img
                          src={user.userAvatar} alt={user.userName}
                          className="rounded-full border-white border-[3px] max-w-20 max-h-20"
                        />
                        {userName === user.userName ?
                          <h1 className="font-black text-2xl max-w-44 truncate bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">{user.userName.toUpperCase()}</h1>
                          :
                          <h1 className="font-black text-2xl max-w-44 truncate">{user.userName.toUpperCase()}</h1>
                        }
                      </div>
                    ))
                  ) : (
                    <p>Cargando..</p>
                  )}
                </div>
                <LobbyChat lobbyID={id}/>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <CopyToClipboard toCopy={id}/>
              <button onClick={() => handleLeave(userID)} className="bg-black/25 rounded-xl p-2 hover:bg-black/50">
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}