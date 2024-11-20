import Particles from "react-tsparticles"

export const Background = ({children}) => {
  return (
    <div className="bg-gradient-to-bl from-primaryPurple to-secondaryBlue w-full h-screen">
      <Particles
      id="particles-js"
      options={{
        particles: {
          number: {
            value: 100, // Número de partículas
            density: {
              enable: true,
              value_area: 800, // Densidad de las partículas
            },
          },
          shape: {
            type: "circle", // Forma de las partículas
          },
          opacity: {
            value: 0.5, // Opacidad de las partículas
            random: true,
          },
          size: {
            value: 10, // Tamaño de las partículas
            random: true,
          },
          move: {
            enable: true,
            speed: 5, // Velocidad de movimiento de las partículas
            direction: "bottom-left", // Dirección de las partículas (meteorito caído)
            random: true,
            out_mode: "out", // Cómo se comportan las partículas fuera del área
          },
        },
      }}
      className="h-full w-full"/>
      <div className="bg-[url('/public/pattern.jpg')] w-full h-full opacity-[.02]">
        {children}
      </div>
    </div>
  )
}