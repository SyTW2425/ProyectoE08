export const LobbyCard = ({ hostName, hostAvatar, playerCount, onClick }) => {
    return (
        <div className="flex flex-row items-center justify-between w-full h-20 p-2 bg-secondaryBlue rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex flex-row items-center justify-start w-1/2">
                <img src={hostAvatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-primaryPurple" />
                <p className="ml-2 text-white text-lg font-bold">{hostName}</p>
            </div>
            <div className="flex flex-row items-center justify-center w-1/4">
                <p className="text-primaryPurple text-lg font-bold">{playerCount}/4</p>
            </div>
            <div className="flex flex-row items-center justify-end w-1/4">
                <button onClick={onClick} className="w-20 h-10 bg-primaryPurple rounded-lg shadow-lg text-white font-bold transform transition-transform duration-300 hover:scale-110">Unirse</button>
            </div>
        </div>
    );
};