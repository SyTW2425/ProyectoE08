export const UserInput = ({text}) => {
  return (
    <label className="mb-4">
      <p className="mb-2 text-white text-sm font-semibold">{text}</p>
      <input type="text"placeholder="Escribe aquí..." className="appearance-none outline-none border-4 border-white h-12 w-auto bg-white/10 rounded-xl p-1"/>
    </label>
  )
}