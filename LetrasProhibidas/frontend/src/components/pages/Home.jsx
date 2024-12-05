import { BentoItem } from "../assets/BentoItem";
import { useAuth } from "../hooks/useAuth";
export const Home = ({}) => {
  const { logout } = useAuth()
  
  return (
    <div>
      <div>
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
              <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
              <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="grid h-full w-full gap-4 p-2 grid-cols-5 grid-rows-4 rounded-lg shadow-md">
                    <div className="col-span-2 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                      <BentoItem title="PERFIL" description="Echa un vistazo a tus partidas ganadas, estadísticas y logros." background="bento/profile.webp" route="/profile"/>
                    </div>
                    <div className="col-span-3 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                      <BentoItem title="JUGAR" description="¿No tienes con quién jugar? No hay problema, busca una partida y conoce gente nueva." background="bento/play.webp"/>
                    </div>
                    <div className="col-span-3 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                      <BentoItem title="UNIRSE" description="Pide a tus amigos el código de la sala y juega junto a ellos." background="bento/join.webp"/>
                    </div>
                    <div className="col-span-2 row-span-2 rounded-lg shadow-md flex items-center justify-center">
                      <BentoItem title="CREAR SALA" description="Crea una sala con tus propias reglas, ¡no te olvides de invitar a tus amigos!" background="bento/create.webp"/>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={logout}>
                Logout
              </button>
            </div>
      </div>
    </div>

  )
}