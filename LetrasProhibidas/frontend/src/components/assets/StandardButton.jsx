export const StandardButton = ({ text, onClick }) => {
  return (
  <button onClick={() => onClick()} className="bg-black/25 rounded-xl p-2 hover:bg-black/50">
      {text}
  </button>
  )
}