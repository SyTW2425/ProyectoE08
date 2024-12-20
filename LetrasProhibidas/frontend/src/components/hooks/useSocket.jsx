import { useContext, createContext, useState, Children, useEffect } from "react";
import { io } from "socket.io-client"

export const useSocket = () => useContext(SocketContext)

const SocketContext = createContext()

export const SocketProvider = ({children}) => {
  // Conectarnos al socket server
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket)
  }, []);
  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  )
}

