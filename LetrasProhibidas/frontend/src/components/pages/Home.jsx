import { useEffect, useState } from "react"

// const response = await axios.get("http://localhost:5000/protected", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },

export const Home = () => {
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
    <p>
      {
        userData ? JSON.stringify(userData) : "Cargando.."
      }
    </p>
  )
}