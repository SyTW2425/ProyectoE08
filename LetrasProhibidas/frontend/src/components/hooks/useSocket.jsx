import { useContext, createContext, useState, useEffect } from "react";
import { io } from "socket.io-client"

export const useSocket = () => useContext(SocketContext)

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = () => {
    const newSocket = io("http://localhost:5000", {
      reconnectionAttempts: Infinity, // Intentar reconectar indefinidamente
      reconnectionDelay: 1000, // Intentar reconectar cada 1 segundo
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return newSocket;
  };

  useEffect(() => {
    const newSocket = connectSocket();
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectSocket }}>
      {children}
    </SocketContext.Provider>
  )
}