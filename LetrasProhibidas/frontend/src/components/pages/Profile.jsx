import { useEffect, useState } from "react"
import { StatCard } from "../assets/StatCard"
import { StandardButton } from "../assets/StandardButton"
import { useNavigate } from "react-router-dom"

export const Profile = () => {
  const [userData, setUserData] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userID");
      if (token) {
        try {
          const response = await fetch(`http://localhost:5000/user/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if (response.ok) {
            const result = await response.json()
            setUserData(result)
          }
          else {
            console.log("error")
          }
        }
        catch (err) {
          console.log(err)
        }
      }
      else console.log("error")
    }
    fetchData()
  }, [])
  return (
    <div>
      {userData ? 
        <div>
          <div>
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
              <h1 className="text-[64px] font-black"><span className="text-white">¡HOLA</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">{userData.name.toUpperCase()}</span>!</h1>
              <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
                <div className="flex h-full w-full items-center flex-col gap-10">
                  <img
                    src={userData.avatarSrc}
                    className="rounded-full border-white border-[7px] max-w-56 max-h-56"
                  />
                  <div className="flex items-center gap-4">
                    <StatCard title="partidas jugadas" number={userData.gamesPlayed}/>
                    <StatCard title="partidas ganadas" number={userData.gamesWon}/>
                    <StatCard title="palabras acertadas" number={userData.wordsGuessed}/>
                  </div>
                </div>
              </div>
              <StandardButton text="Volver" onClick={() => navigate("/")}/>
            </div>
          </div>
        </div>
        :
        "cargando"
      }
    </div>
  )
}