import { RandomIcon } from "../icons/RandomIcon"

export const RandomButton = ({ className, onClick }) => {
  return (
    <button className={`${className} rounded-full border-primaryPurple border-4 p-2 bg-white text-primaryPurple`} onClick={() => onClick()}>
      <RandomIcon />
    </button>
  )
}