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
        {disabled && (
          <svg
            className="absolute right-3 top-3 w-6 h-6 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v2H8V6zm-3 6a1 1 0 011-1h8a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <button type="submit" className={`rounded-xl h-12 p-2 border-4 ${disabled ? "bg-gray-300 border-white" : "bg-black/25 hover:bg-black/50 border-white"}`} disabled={disabled}>
        Enviar
      </button>
    </form>
  );
};
