import { useState } from "react";

export const GameInput = ({ onChange, placeholder="Escribe aquí...", handleSend }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(inputValue);
    setInputValue("");
  };

  return (
    <form className="flex flex-row items-center p-2 justify-center" onSubmit={handleSubmit}>
      <div className="p-2 w-96">
        <input
          type="text"
          className="appearance-none outline-none border-4 border-white h-12 w-full bg-white/10 rounded-xl p-1 text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-black/25 rounded-xl h-12 p-2 hover:bg-black/50 border-4 border-white">
        Enviar
      </button>
    </form>
  );
};
