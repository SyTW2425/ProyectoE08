import { PlayButton } from "./assets/PlayButton"
import { RandomButton } from "./assets/RandomButton"


export const Login = () => {
  return (
    <div className="flex flex-row items-center gap-10">
      <div className="relative">
        <img
          src="/avatar.jpg"
          className="rounded-full border-white border-[7px] max-w-56 max-h-56"
        />
        <RandomButton className="top-1 right-4 absolute"/>
      </div>

      <div className="flex flex-col justify-center">
        <label className="mb-4">
          <p className="mb-2 text-white text-lg font-semibold">NOMBRE DE USUARIO</p>
          <input type="text" className="appearance-none outline-none border-4 border-white h-12 w-auto bg-white/10 rounded-xl p-1"/>
        </label>
        <label className="mb-4">
          <p className="mb-2 text-white text-lg font-semibold">CONTRASEÑA</p>
          <input type="password" className="appearance-none outline-none border-4 border-white h-12 w-auto bg-white/10 rounded-xl p-1"/>
        </label>
        <PlayButton/>
      </div>
    </div>
  )
}