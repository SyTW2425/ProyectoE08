import { Life } from "../icons/Life"

export const UserCarousel = ({ players, turn, guessTries }) => {
  const userName = localStorage.getItem("userName");

  return (
    <div className="flex flex-row justify-center items-center">
      {
        players.map((player) => (
          <div
            key={player.userID}
            className={`p-4 flex flex-col justify-center items-center gap-2 relative ${turn === player.userID ? "border-primaryBlue border-4" : ""}`}
          >
            {
              player.lives > 0 && guessTries.filter(guessTry => guessTry.userID === player.userID).map((guessTry, index) => (
                <div key={index} className={`absolute left-24 top-4 bg-white text-black p-2 rounded-xl border-4 ${guessTry.isCorrect ? "border-green-400" : "border-red-400"}`}>{guessTry.word}</div>
              ))
            }
            <img
              src={player.userAvatar} alt={player.userName}
              className={`rounded-full border-white border-4 max-w-36 max-h-36 ${player.lives === 0 ? "filter grayscale" : ""}`}
            />
            <div className={`font-bold text-2xl ${player.userName === userName ? "text-primaryBlue" : ""}`}>
              <h1>{player.userName.toUpperCase()}</h1>
              <div className="flex items-center justify-center">
                {player.lives >= 0 ? (
                  Array.from({ length: player.lives }).map((_, i) => (
                    <Life key={i} />
                  ))
                ) : (
                  <Life />
                )}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}