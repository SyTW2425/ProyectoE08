import { RandomIcon } from "../icons/RandomIcon"

export const RandomButton = ({className}) => {
  return (
    <button className={`${className} rounded-full border-primaryPurple border-4 p-2 bg-white text-primaryPurple`}>
      <RandomIcon/>
    </button>
  )
}