import { useEffect, useState } from "react"

export const Profile = () => {
  const [userData, setUserData] = useState()
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
      HOLA
    </div>
  )
}