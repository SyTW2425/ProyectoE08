import React, { useState, useEffect } from "react";

export const Loader = () => {
  const lettersLine1 = "LETRAS";
  const lettersLine2 = "PROHIBIDAS";
  const [activeLetters, setActiveLetters] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLetters((prevActive) => {
        const newActive = [...prevActive];
        if (newActive.length < lettersLine1.length + lettersLine2.length) {
          newActive.push(newActive.length);
        } else {
          newActive.shift();
        }
        return newActive;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const renderLetters = (letters, offset) => (
    letters.split("").map((letter, index) => (
      <span
        key={index + offset}
        className={`inline-block mx-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-300 ease-in-out font-poppins
          ${activeLetters.includes(index + offset)
            ? "text-primaryBlue transform translate-y-[-10px] scale-110"
            : "text-white/30"
          }`}
        style={{
          textShadow: activeLetters.includes(index + offset)
            ? "0 0 10px rgba(0, 123, 255, 0.7), 0 0 20px rgba(0, 123, 255, 0.5)"
            : "none",
        }}
      >
        {letter}
      </span>
    ))
  );

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mb-8 relative">
          <div>{renderLetters(lettersLine1, 0)}</div>
          <div>{renderLetters(lettersLine2, lettersLine1.length)}</div>
        </div>
        <div className="relative">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-transparent via-primaryBlue to-transparent font-poppins opacity-75 animate-pulse"></div>
          <p className="text-white text-base sm:text-lg md:text-xl font-semibold tracking-wider">
            {"CARGANDO...".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};
