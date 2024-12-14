import { useNavigate } from "react-router-dom"


export const BentoItem = ({title, description, background, onClick}) => {

  return (
    <button style={{ backgroundImage: `url(${background})` }} 
            className="bg-cover bg-center w-full h-full rounded-lg flex flex-col justify-end border-[4px] grayscale hover:grayscale-0 transition duration-150 ease-in-out border-white"
            onClick={() => onClick()}
            >
      
      <div className="p-2 bg-gradient-to-t from-black to-transparent rounded-lg w-full text-left">
        <h1 className="font-black text-3xl drop-shadow-md">{title}</h1>
        <p className="line-clamp-2 text-lg">{description}</p>
      </div>
    </button>
  )
}