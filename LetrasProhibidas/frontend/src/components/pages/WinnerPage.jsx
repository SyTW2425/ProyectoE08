import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { StandardButton } from "../assets/StandardButton"

export const WinnerPage = ({ lobbyID, winnerID }) => {
    const navigate = useNavigate();
    const [winner, setWinner] = useState(null)
    const [loading, setLoading] = useState(true);
    const userID = localStorage.getItem("userID")

    const handleReturnToLobby = () => {
        navigate(`/lobby/${lobbyID}`);
    };

    // Buscar información del usuario ganador.
    const fetchWinnerData = useCallback(async () => {
        console.log("ejecuto");
        try {
          const response = await fetch(`http://localhost:5000/user?id=${winnerID}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setWinner({name: data.name.toUpperCase(), avatar: data.avatarSrc })
          console.log(data)
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }, []);

      useEffect(() => {
        fetchWinnerData()
      }, [])

    return (
        <div className="font-poppins">
            {winner && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-white m-4">{userID === winnerID ? 
                        (
                            <div>¡HAS GANADO, <span className="text-primaryBlue">{winner.name}</span>!</div>
                        ) : (
                            <div>¡HA GANADO <span className="text-primaryBlue">{winner.name}</span>!</div>
                        )
                        }
                    </h1>
                    <div className="w-56 h-56 flex items-center justify-center border-white border-[7px] rounded-full mb-4">
                      {loading && (
                        <div className="w-10 h-10 border-4 border-t-4 border-t-white border-gray-200 rounded-full animate-spin"></div>
                      )}
                      <img
                        src={winner.avatar}
                        className={`rounded-full ${loading ? "hidden" : "block"
                          }`}
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                      />
                    </div>
                    <StandardButton text="Volver a la Lobby" onClick={handleReturnToLobby} />
                </div>
                )
            }
        </div>
    );
};