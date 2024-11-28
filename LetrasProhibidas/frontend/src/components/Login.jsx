import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"
import Modal from "./Modal"
import { avatars } from "../utils/avatars"


export const Login = ({onLogin}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);

  const handleLogin = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      setIsModalOpen(true);
      return;
    }

    try {
      await onLogin({ username, password });
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
        <img
          src={avatar}
          className="rounded-full border-white border-[7px] max-w-56 max-h-56"
        />
        <RandomButton className="top-1 right-4 absolute" onClick={handleClick} />
      </div>

      <form className="flex flex-col justify-center" onSubmit={ (e) => {
        e.preventDefault()
        handleLogin()
      }
      }>
        <UserInput text="NOMBRE DE USUARIO" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="¡JUGAR!" type="submit" />
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Error Inesperado">
        <p>{errorMessage}</p>
      </Modal>
    </div>
  )
}