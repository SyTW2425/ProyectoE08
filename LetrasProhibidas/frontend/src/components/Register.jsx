import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"
import Modal from "./Modal"
import validator from "validator"
import { avatars } from "../utils/avatars"
import { useAuth } from "./hooks/useAuth"
import { useNavigate } from "react-router-dom"


export const Register = ({onRegister}) => {
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const {register} = useAuth();
  const navigate = useNavigate()


  const validateInputs = () => {
    if (!email || !name || !password) {
      return "Todos los campos son obligatorios.";
    }
    if (!validator.isEmail(email)) {
      return "El correo electrónico no es válido.";
    }
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+={}[\]:;'"<>,.?/~`|\\]{8,}$/.test(password)) {
      return "La contraseña debe contener al menos una letra mayuscula y un número.";
    }
    return null;
  };

  const handleRegister = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      setIsModalOpen(true);
      return;
    }

    try {
      await register({ email, name, password, avatar });
      navigate("/")
    } catch (error) {
      setErrorMessage(error.message); // Actualiza el mensaje de error
      setIsModalOpen(true); // Muestra el modal
    }
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
        handleRegister()
      }

      }>
        <UserInput text="CORREO ELECTRÓNICO" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <UserInput text="NOMBRE DE USUARIO" type="text" value={name} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="VALE" type="submit" />
      </form>

    
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Error inesperado">
        <p>{errorMessage}</p>
      </Modal>
    </div>
  )
}