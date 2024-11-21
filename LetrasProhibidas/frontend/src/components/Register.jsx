import { ConfirmButton } from "./assets/ConfirmButton"
import { RandomButton } from "./assets/RandomButton"
import { UserInput } from "./assets/UserInput"

export const Register = () => {
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
        <UserInput text="CORREO ELECTRÓNICO" type="text" />
        <UserInput text="NOMBRE DE USUARIO" type="email" />
        <UserInput text="CONTRASEÑA" type="password" />
        <ConfirmButton text="VALE" />
      </div>
    </div>
  )
}