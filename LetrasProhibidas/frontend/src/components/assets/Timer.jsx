import { useState, useEffect } from "react";

export const Timer = ({ maxTime = 20, className }) => {
  const [time, setTime] = useState(maxTime);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setTimeout(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  return (
    <div className={className}>
      <p className="text-4xl font-bold">{time}</p>
    </div>
  );
};
