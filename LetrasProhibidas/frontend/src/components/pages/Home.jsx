import { useEffect, useState } from "react"
// Esto es una prueba para lo de la autenticacion
export const Home = ({onLogout}) => {
  const [userData, setUserData] = useState(null);
  useEffect(() =>  {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userID");
      if (!token) console.log("No hay token")

      try {
        const response = await fetch(`http://localhost:5000/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const result = await response.json();
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
    fetchData()
  }, [])
  return (
    <div>
      <div>
        {
          userData ? 
          <div>
            {JSON.stringify(userData)}
            <button onClick={() => onLogout()}>Logout</button>
          </div>
          : 
          <p>"Cargando.."</p>
        }
      </div>
    </div>

  )
}