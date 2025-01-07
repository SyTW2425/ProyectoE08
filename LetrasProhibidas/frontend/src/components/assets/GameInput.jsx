import { useState } from "react";

export const GameInput = ({ onChange, placeholder = "Escribe aquí...", handleSend, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return;
    if (!disabled) {
      handleSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <form className="flex flex-row items-center p-2 justify-center" onSubmit={handleSubmit}>
      <div className="relative p-2 w-96">
        <input
          type="text"
          className={`appearance-none outline-none border-4 h-12 w-full rounded-xl p-1 text-sm ${disabled ? "bg-gray-300 border-white" : "bg-white/10 border-white"}`}
          placeholder={disabled ? "No es tu turno" : placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
        />
      </div>
      <button type="submit" className={`rounded-xl h-12 p-2 border-4 ${disabled ? "bg-gray-300 border-white" : "bg-black/25 hover:bg-black/50 border-white"}`} disabled={disabled}>
        Enviar
      </button>
    </form>
  );
};
