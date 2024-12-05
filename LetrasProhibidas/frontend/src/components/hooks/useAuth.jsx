import { useContext, createContext, useState, Children, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => useContext(AuthContext)

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      const token = localStorage.getItem("token");
      return token ? true : false; // Si el token existe, esAuthenticated será true
    });
  // Vamos a hacer que el usuario solo tenga que iniciar sesion cuando no tiene un jwt o no esté vigente.
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
        throw new Error("Usuario o contraseña incorrecta")
      }
    } catch (error) {
        console.error("Error during login:", error);
        throw new Error(error)
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
        const { token, message, userID } = await response.json();
        localStorage.setItem("token", token)
        localStorage.setItem("userID", userID)
        console.log(message)
        setIsAuthenticated(true)
      } else {
        console.error("Failed to register user:", response.statusText);
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.error("Error during registration:", error);
      throw new Error(error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{isAuthenticated, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

