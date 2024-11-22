import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"
import { useState } from "react"


export const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Starting login process...");

    try {
      // Verificamos que el usuario existe
      const response = await fetch(`http://localhost:5000/user?name=${username}`);
      if (response.ok) {
        const user = await response.json();

        // Verificamos la contraseña
        const response2 = await fetch(`http://localhost:5000/user/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: username, password })
        });

        if (response2.ok) {
          console.log("User logged in:");
        } else {
          console.error("Failed to login:", response2.statusText);
        }
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error during login:", error);
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
        <UserInput text="NOMBRE DE USUARIO" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <UserInput text="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ConfirmButton text="¡JUGAR!" onClick={handleLogin} />
      </div>
    </div>
  )
}