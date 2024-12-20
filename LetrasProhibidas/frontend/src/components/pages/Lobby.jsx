import { useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState } from "react"

export const Lobby = () => {
  const { id } = useParams()
  const { socket } = useSocket()
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/lobby?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json(); // No olvides parsear el JSON
        setUsers(data.players);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lobby data:", err);
      }
    };

    fetchLobbyData();

    const handleNewUser = (userID) => {
      console.log("Se ha unido el usuario", userID);
      fetchLobbyData()
    };

    if (socket) {
      socket.on("newUser", ({ userID }) => handleNewUser(userID));
    }

    return () => {
      if (socket) {
        socket.off("newUser", handleNewUser);
      }
    };
  }, [id, socket]);
  
  return (
    <div>
      {users ? (
        users.map(user => (
          <div key={user.userID}>
            <h1>{user.userName}</h1>
            <img src={user.userAvatar} alt={user.userName} />
          </div>
        ))
      ) : (
        <p>Cargando..</p>
      )}
    </div>
  )  
}