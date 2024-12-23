import { useEffect, useState, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { useSocket } from "./hooks/useSocket";

export const LobbyChat = ({ lobbyID }) => {
  const userAvatar = localStorage.getItem("userAvatar")
  const userName = localStorage.getItem("userName")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState([]) // Mensajes del chat
  const { socket } = useSocket()
  const messagesEndRef = useRef(null);


  const handleSend = () => {
    const newMessage = {text: inputValue, sender: userName}
    setMessages((prevMessages) => [...prevMessages, newMessage])
    socket.emit("sendMessage",({ message: newMessage, lobbyID }))
    setInputValue("")
  }

  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

    useEffect(() => {
      if (socket) {
        socket.on("newMessage", ({ message }) => handleNewMessage(message));
      }
  
      return () => {
        if (socket) {
          socket.off("newMessage"); // Importantisimo
        }
      };
    }, [socket]);

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

  return (
    <div className="bg-black/30 h-[400px] flex flex-col justify-between w-full p-2 rounded-xl">
      {/* Contenedor de los mensajes */}
      <div className="
        flex-1 p-2 
        overflow-y-scroll
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {messages.map((message, index) =>
          <ChatMessage text={message.text} sender={message.sender} key={index}/>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form className="flex flex-row items-center p-2 justify-center" onSubmit={ (e) => {
        e.preventDefault()
        handleSend()
        e.target.reset()
      }}>
        <div className="p-2">
          <input
            type="text"
            className="appearance-none outline-none border-4 border-white h-12 w-full bg-white/10 rounded-xl p-1 text-sm"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-black/25 rounded-xl h-12 p-2 hover:bg-black/50 border-4 border-white">
                  Enviar
        </button>
      </form>
    </div>
  );
};
