import { useState, useEffect } from "react";

export const Timer = ({ maxTime = 20, className }) => {
  const [time, setTime] = useState(maxTime);
  const radius = 50; // Radio del círculo
  const circumference = 2 * Math.PI * radius; // Circunferencia completa

  useEffect(() => {
    if (time <= 0) return;

    const timer = setTimeout(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  const progress = (time / maxTime) * circumference; // Calcular progreso

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
          className={`text-primaryBlue transition-all duration-1000 ease-linear ${time === 0 ? "text-red-500 animate-pulse" : ""
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
        className={`absolute text-xl font-bold ${time <= 5 ? "text-red-500 animate" : "text-white"
          }`}
      >
        {time > 0 ? time : "¡Fin!"}
      </span>
    </div>
  );
};