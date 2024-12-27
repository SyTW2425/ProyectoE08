import { useEffect, useState } from 'react';
import { LobbyCard } from '../assets/lobbyCard';
import { Navigate, useNavigate } from 'react-router-dom';

export const Play = () => {
    const [lobbies, setLobbies] = useState([]);
    const [hostDetails, setHostDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchLobbies = async () => {
            try {
                const response = await fetch('http://localhost:5000/lobby/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch lobbies');
                }
                const data = await response.json();
                if (isMounted) {
                    setLobbies(data);

                    // Fetch host details
                    const hostIDs = data.map(lobby => lobby.hostID);
                    const hostDetails = await fetchHostDetails(hostIDs);
                    if (isMounted) {
                        setHostDetails(hostDetails);
                        console.log('Host details:', hostDetails);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching lobbies:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const fetchHostDetails = async (hostIDs) => {
            const hostDetails = {};
            for (const hostID of hostIDs) {
                try {
                    const response = await fetch(`http://localhost:5000/user?id=${hostID}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user with ID ${hostID}`);
                    }
                    const user = await response.json();
                    hostDetails[hostID] = { name: user.name, avatar: user.avatarSrc };
                } catch (err) {
                    console.error(`Error fetching user with ID ${hostID}:`, err);
                }
            }
            return hostDetails;
        };

        fetchLobbies();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
                <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
                <div className="
                    h-full w-[50rem] flex flex-col gap-4 items-center justify-start p-3 overflow-y-auto overflow-x-hidden
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    {loading ? (
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primaryBlue" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        lobbies.sort((firstLobby, secondLobby) => secondLobby.players.length - firstLobby.players.length).map(lobby => (
                            <LobbyCard
                                key={lobby.lobbyID}
                                hostName={hostDetails[lobby.hostID]?.name || 'Loading...'}
                                lobbyID={lobby.lobbyID}
                                hostAvatar={hostDetails[lobby.hostID]?.avatar || 'Loading...'}
                                playerCount={lobby.players.length}
                                maxPlayers={lobby.maxPlayers}
                                onClick={() => navigate(`/lobby/${lobby.lobbyID}`)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};