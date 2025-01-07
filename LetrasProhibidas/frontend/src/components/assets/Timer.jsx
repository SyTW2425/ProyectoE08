import { useEffect } from "react";

export const Timer = ({ timeLeft, className }) => {
  const radius = 50; // Radio del círculo
  const circumference = 2 * Math.PI * radius; // Circunferencia completa

  const progress = (timeLeft / 20) * circumference; // Calcular progreso

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Círculo SVG */}
      <svg
        className="w-28 h-28"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-100"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          fill="none"
          stroke="currentColor"
        />
        <circle
          className={`text-primaryBlue transition-all duration-1000 ease-linear ${timeLeft === 0 ? "text-red-500 animate-pulse" : ""
            }`}
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          fill="none"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>

      <span
        className={`absolute text-xl font-bold ${timeLeft <= 5 ? "text-red-500 animate" : "text-white"
          }`}
      >
        {timeLeft > 0 ? timeLeft : "¡Fin!"}
      </span>
    </div>
  );
};