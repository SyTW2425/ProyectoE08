import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"


export const Login = ({onLogin}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    onLogin({username, password})
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
        <UserInput text="NOMBRE DE USUARIO" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="¡JUGAR!" onClick={handleLogin} />
      </div>
    </div>
  )
}