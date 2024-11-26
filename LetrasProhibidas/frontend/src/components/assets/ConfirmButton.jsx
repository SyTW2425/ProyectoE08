export const ConfirmButton = ({ text, onClick, className }) => {
  return (
    <button
      className={`font-poppins font-black text-2xl p-1 rounded-xl bg-white border-primaryPurple border-[4px] ${className}`}
      onClick={onClick}
    >
      <p className="text-primaryPurple">{text}</p>
    </button>
  );
};