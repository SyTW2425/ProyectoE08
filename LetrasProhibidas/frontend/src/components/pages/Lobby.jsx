import { useParams } from "react-router-dom"

export const Lobby = () => {
  const { id } = useParams()
  return (
    <div>
      <h1>Lobby</h1>
      <p>Este es el lobby { id }</p>
    </div>
  )
}