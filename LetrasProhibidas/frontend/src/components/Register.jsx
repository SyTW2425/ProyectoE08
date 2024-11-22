import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"

export const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    console.log("Starting registration process...");
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, name, password })
      });

      if (response.ok) {
        const user = await response.json();
        console.log("User registered:");
      } else {
        console.error("Failed to register user:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
    </div>
  )
}