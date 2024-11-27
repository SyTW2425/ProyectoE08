import { Fence } from "lucide-react";
import { useContext, createContext, useState, Children } from "react";

export const useAuth = () => useContext(AuthContext)

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async({username, password}) => {
    console.log("Starting login process...");
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: username, password})
      });
      
      if (response.ok) {
        const { token, message, userID } = await response.json();
        setIsAuthenticated(true)
        localStorage.setItem("token", token)
        localStorage.setItem("userID", userID)
        console.log(message)
      } else {
        console.log("Usuario o contraseña incorrecta")
      }
    } catch (error) {
        console.error("Error during login:", error);
    }
  }

  const register = async ({email, name, password}) => {
    console.log("Starting registration process...");
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, name, password })
      });

      if (response.ok) {
        const user = await response.json();
        console.log("User registered:");
        setIsAuthenticated(true)
      } else {
        console.error("Failed to register user:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  return (
    <AuthContext.Provider value={{isAuthenticated, login, register}}>
      {children}
    </AuthContext.Provider>
  )
}

