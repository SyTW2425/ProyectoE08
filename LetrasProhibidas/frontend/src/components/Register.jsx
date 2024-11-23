import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"
import Modal from "./Modal"
import validator from "validator"

export const Register = ({onRegister}) => {
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      await onRegister({ email, name, password });
    } catch (error) {
      setErrorMessage(error.message); // Actualiza el mensaje de error
      setIsModalOpen(true); // Muestra el modal
    }
  };

  return (
    <div className="flex flex-row items-center gap-10">
      <div className="relative">
        <img
          src="/avatar.jpg"
          className="rounded-full border-white border-[7px] max-w-56 max-h-56"
        />
        <RandomButton className="top-1 right-4 absolute" />
      </div>

      <div className="flex flex-col justify-center">
        <UserInput text="CORREO ELECTRÓNICO" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <UserInput text="NOMBRE DE USUARIO" type="text" value={name} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="VALE" onClick={handleRegister} />
      </div>

    
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Error">
        <p>{errorMessage}</p>
      </Modal>
    </div>
  )
}