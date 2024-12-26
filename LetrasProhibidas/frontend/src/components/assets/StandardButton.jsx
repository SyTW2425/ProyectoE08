export const StandardButton = ({ text, onClick }) => {
  return (
    <button
      onClick={() => onClick()}
      className="bg-black/25 rounded-xl p-4 hover:bg-black/50 text-lg"
    >
      {text}
    </button>
  );
};
