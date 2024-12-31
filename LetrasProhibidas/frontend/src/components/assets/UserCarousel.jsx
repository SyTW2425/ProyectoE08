import { Life } from "../icons/Life"

export const UserCarousel = ({players, turn}) => {
  return (
    <div className="flex flex-row justify-center items-center">
      {
        players.map((player) => (
          <div className="p-4 flex flex-col justify-center items-center gap-2">
            <img
              src={player.userAvatar} alt={player.userName}
              className="rounded-full border-white border-4 max-w-36 max-h-36"
            />
            <div className="font-bold text-2xl">
              <h1>{player.userName.toUpperCase()}</h1>
              <div className="flex items-center justify-center">
                {Array.from({length: player.lives}).map((_, i) => (
                  <Life key={i}/>
                ))}
              </div>
            </div>
          </div>

        ))
      }
    </div>
  )
}