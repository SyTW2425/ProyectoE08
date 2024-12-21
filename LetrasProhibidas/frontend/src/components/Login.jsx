import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"
import { WarningModal } from "./WarningModal"
import { avatars } from "../utils/avatars"
import { useAuth } from "./hooks/useAuth"
import { useNavigate } from "react-router-dom"

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [loading, setLoading] = useState(true);
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      setIsModalOpen(true);
      return;
    }
    
    try {
      await login({ username, password, avatar });
      navigate("/")
    } catch (error) {
      setErrorMessage("Usuario o contraseña incorrectos.");
      setIsModalOpen(true);
    }
  };

  const validateInputs = () => {
    if (!username || !password) {
      return "Todos los campos son obligatorios.";
    }
    return null;
  };

  const handleClick = () => {
    let index = 0
    while (avatars[index] === avatar) {
      index = Math.floor(Math.random() * avatars.length)
    }
    setAvatar(avatars[index])
  }

  return (
    <div className="flex flex-row items-center gap-10">
      <div className="relative">
        <div className="w-56 h-56 flex items-center justify-center border-white border-[7px] rounded-full">
          {loading && <div className="w-10 h-10 border-4 border-t-4 border-t-white border-gray-200 rounded-full animate-spin"></div>}
          <img
            src={avatar}
            className={`rounded-full ${loading ? 'hidden' : 'block'}`}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
        <RandomButton className="top-1 right-4 absolute" onClick={handleClick} />
      </div>

      <form className="flex flex-col justify-center" onSubmit={ (e) => {
        e.preventDefault()
        handleLogin()
      }}>
        <UserInput text="NOMBRE DE USUARIO" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="¡JUGAR!" type="submit" />
      </form>

      <WarningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Error Inesperado">
        <p>{errorMessage}</p>
      </WarningModal>
    </div>
  )
}