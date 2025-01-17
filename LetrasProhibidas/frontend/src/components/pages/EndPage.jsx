import { useNavigate } from "react-router-dom"
import { StandardButton } from "../assets/StandardButton"

export const EndPage = ({ lobbyID }) => {
    const navigate = useNavigate();

    const handleReturnToLobby = () => {
        navigate(`/lobby/${lobbyID}`);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Pagina final</h1>
            <StandardButton text="Volver a la Lobby" onClick={handleReturnToLobby} />
        </div>
    );
};