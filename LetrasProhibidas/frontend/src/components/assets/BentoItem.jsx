import { useState } from "react";

export const BentoItem = ({ title, description, background, onClick }) => {
  const [loading, setLoading] = useState(true);

  return (
    <button 
      className="relative bg-cover bg-center w-full h-full rounded-lg flex flex-col justify-end border-[4px] border-white group"
      onClick={() => onClick()}
    >
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-t-4 border-t-white border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 z-10 group-hover:bg-opacity-50 transition duration-150 ease-in-out"></div>

      <img 
        src={background} 
        alt={title} 
        className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg z-0 transition duration-150 ease-in-out ${loading ? 'hidden' : 'block'}`}
        onLoad={() => setLoading(false)} 
        onError={() => setLoading(false)} 
      />
      
      <div className="relative p-2 bg-gradient-to-t from-black to-transparent rounded-lg w-full text-left z-20 transition duration-700 ease-in-out">
        <h1 className="font-black text-3xl drop-shadow-md">{title}</h1>
        <p className="line-clamp-2 text-lg">{description}</p>
      </div>
    </button>
  );
};
