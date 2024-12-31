import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState, useCallback } from "react"
import { LobbyChat } from "../LobbyChat"
import { CopyToClipboard } from "../assets/CopyToClipboard"
import { StandardButton } from "../assets/StandardButton"
import { Loader } from "../assets/Loader"
import { Error404 } from "../assets/Error404"
import { PrivacityButton } from "../assets/PrivacityButton"

export const Lobby = () => {
  const { id } = useParams()
  const { socket } = useSocket()
  const [users, setUsers] = useState(null)
  const [numPlayers, setNumPlayers] = useState(0)
  const [maxPlayers, setMaxPlayers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hostID, setHostID] = useState(null) // Estado para almacenar el hostID
  const [isPrivate, setIsPrivate] = useState(true)
  const userName = localStorage.getItem("userName")
  const userID = localStorage.getItem("userID")
  const userAvatar = localStorage.getItem("userAvatar")
  const navigate = useNavigate()

  const handleUserUpdate = () => {
    console.log("Actualizando lista de usuarios")
    fetchLobbyData()
  };

  const handleLeave = (userID) => {
    socket.emit("leaveLobby", ({ lobbyID: id, userID }))
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
      setHostID(data.hostID); // Almacena el hostID
      setIsPrivate(data.private)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lobby data:", err);
      setLoading(false);
      setError(true);
    }
  }, [id]);

  const updateLobbyPrivacy = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/lobby/privacy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lobbyID: id, lobbyPrivate: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lobby status");
      }

      console.log("Lobby status updated successfully");
    } catch (err) {
      console.error("Error updating lobby status:", err);
    }
  };

  const handleCreateGame = async () => {
    try {
      const response = await fetch(`http://localhost:5000/game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "players": [

          ],
          "lobbyID": id
        })
      })
      const data = await response.json()
      const gameID = data.gameID
      // Emito el evento de que estoy creando la partida, lo capturo en el backend, emito el evento de que el juego esta empezando,
      // cuando eso ocurre, cada cliente tiene que enviar un evento con que se quiere unir a la partida, joinGame, esto lo captura el backend
      // y une a todos los usuarios al mismo room de sockets y emite el evento joinedLobby, que captura el cliente y navega hacia la url del game.
      socket.emit("creatingGame", { gameID, userID, userName, userAvatar, lobbyID: id })
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    if (socket) {
      socket.on("userUpdate", () => handleUserUpdate());
      socket.emit("joinLobby", { lobbyID: id, userID, userName, userAvatar })
      socket.on("startingGame", ({ gameID }) => socket.emit("joinGame", {gameID, userID, userName, userAvatar}))
      socket.on("joiningGame", ({ gameID }) => navigate(`/game/${gameID}`))
    }

    fetchLobbyData();

    return () => {
      if (socket) {
        socket.off("userUpdate");
        socket.off("startingGame");
        socket.off("joiningGame");
      }
    };
  }, [fetchLobbyData, socket]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error404 />;
  }

  return (
    <div>
      <div>
        <div>
          <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
            <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
            <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
              <div className="flex h-full w-full justify-between">
                <div className="w-96">
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
                <LobbyChat lobbyID={id} />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-row gap-4 ml-8">
                {userID === hostID && (
                  <>
                    <PrivacityButton
                      initialStatus={isPrivate}
                      onChange={(newStatus) => {
                        console.log("Privacity changed to:", newStatus);
                        updateLobbyPrivacy(newStatus);
                      }}
                    />
                    <StandardButton text="Jugar Partida" onClick={() => handleCreateGame()}/>
                  </>
                )}
                <CopyToClipboard toCopy={id} />
                <StandardButton text="Salir" onClick={() => handleLeave(userID)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}