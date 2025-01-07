export const LobbyCard = ({ hostName, hostAvatar, playerCount, maxPlayers, onClick }) => {
    return (
        <div className="flex flex-row items-center justify-between w-full h-20 p-4 bg-secondaryBlue rounded-lg shadow-lg">
            <div className="flex flex-row items-center justify-start w-1/2">
                <img src={hostAvatar} alt="avatar" className="w-16 h-16 rounded-full border-4 border-white" />
                <p className="m-4 text-white text-2xl font-bold">LOBBY DE <span className="text-primaryBlue">{hostName.toUpperCase()}</span></p>
            </div>
            <div className="flex flex-row items-center">
                <p className={`text-white text-lg font-bold m-4 ${playerCount !== maxPlayers ? "text-green-300" : "text-red-300"}`}>{playerCount}/{maxPlayers}</p>
                <button onClick={onClick} className="w-20 h-10 bg-white border-2 border-primaryPurple rounded-lg shadow-lg text-primaryPurple font-bold hover:bg-white/80">Unirse</button>
            </div>
        </div>
    );
};