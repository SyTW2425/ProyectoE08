import { useParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"

export const Game = () => {
  const { id } = useParams()
  const { socket } = useSocket()

  
  return (
    <p> este es el game {id}</p>
  )
}