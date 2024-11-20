import { Background } from "./Background"

export const Login = () => {
  return(
    <Background>
      <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl">
        <h1 className="p-5 text-[64px] font-bold"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
        <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start">
          <div className="h-full w-[34rem] bg-black/30 rounded-xl"></div>
          <div className="h-full w-[15rem] bg-black/30 rounded-xl"></div>
        </div>
      </div>
    </Background>
  )
}