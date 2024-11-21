import { useState } from "react"
import { Background } from "./Background"
import { LoginButton } from "./LoginButton"

export const Login = () => {
  const [activeButton, setActiveButton] = useState("login")
  return(
    <Background>
      <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins">
        <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
        <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
          <div className="h-full w-[34rem] bg-black/30 rounded-xl">
            <div className="flex w-full">
              <LoginButton 
                text={"INICIA SESION"} 
                className={`flex-1 ${activeButton === "login" ? "bg-black/70 text-primaryBlue" : "bg-black/30 text-white"}`}
                onClick={() => setActiveButton("login")}
                />
              <LoginButton 
                text={"REGISTRATE"} 
                className={`flex-1 ${activeButton === "register" ? "bg-black/70 text-primaryBlue" : "bg-black/30 text-white"}`}
                onClick={() => setActiveButton("register")}
              />
            </div>

            {activeButton === "login" ? 
              <p>Esto es el login</p> 
              
              : 
              
              <p>Esto es el register</p>}
          </div>
          <div className="h-full w-[15rem] bg-black/30 rounded-xl text-white p-5 text-xl flex flex-col justify-center items-center">
            <h1 className="text-center pb-3 font-black text-2xl">¿CÓMO JUGAR?</h1>
            <div>
              <p>¡El reto es simple! En cada ronda, tendrás que escribir una palabra sin usar la <span className="text-primaryBlue font-black">letra prohibida</span>.<br></br>
              Pero ojo, ¡el tiempo corre! Si te pasas o la letra aparece, perderás una vida.<br></br>
              ¡Corre, piensa rápido y no dejes que te atrapen!</p>
            </div>
          </div>
        </div>
      </div>
    </Background>
  )
}