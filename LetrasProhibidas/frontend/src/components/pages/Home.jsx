import { useEffect, useState } from "react"
// Esto es una prueba para lo de la autenticacion
export const Home = ({onLogout}) => {
  const [userData, setUserData] = useState(null);
  useEffect(() =>  {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userID");
      if (token){
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
              onLogout()
            }
          }
          catch (err) {
            console.log(err)
            onLogout()
          }
        }
        else onLogout()
    }
    fetchData()
  }, [])
  return (
    <div>
      <div>
        {
          userData ? 
            <div className="h-[40rem] w-[60rem] border-[10px] p-5 rounded-xl border-white/10 backdrop-blur-xl flex flex-col items-center justify-start shadow-xl font-poppins text-white">
              <h1 className="text-[64px] font-black"><span className="text-white">LETRAS</span> <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent">PROHIBIDAS</span></h1>
              <div className="h-full w-[50rem] flex flex-row gap-4 items-center justify-start p-3">
                {/* Aqui va el bento */}
                
                <div className="flex h-full w-full items-center justify-center">
                  <div className="grid h-full w-full gap-4 bg-gray-200 p-2 grid-cols-5 grid-rows-4 rounded-lg shadow-md">
                  
                    <div 
                      className="col-span-2 row-span-2 bg-pink-200 rounded-lg shadow-md flex items-center justify-center"
                    >
                      <p>Salmon</p>
                    </div>
                  
                    <div 
                      className="col-span-3 row-span-2 bg-lime-200 rounded-lg shadow-md flex items-center justify-center"
                    >
                      <p>Broccoli</p>
                    </div>
                  
                    <div 
                      className="col-span-3 row-span-2 bg-yellow-200 rounded-lg shadow-md flex items-center justify-center"
                    >
                      <p>Tamago</p>
                    </div>
                  
                    <div 
                      className="col-span-2 row-span-2 bg-tan-200 rounded-lg shadow-md flex items-center justify-center"
                    >
                      <p>Pork</p>
                    </div>
                  
                  </div>
                </div>

              </div>
            </div>
          : 
          <p>"Cargando.."</p>
        }
      </div>
    </div>

  )
}