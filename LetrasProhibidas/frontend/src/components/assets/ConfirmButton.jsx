export const ConfirmButton = ({ text, onClick, className, type }) => {
  return (
    <button
      className={`font-poppins font-black text-2xl p-1 rounded-xl bg-white border-primaryPurple border-[4px] ${className}`}
      onClick={onClick}
      type={type}
    >
      <p className="text-primaryPurple">{text}</p>
    </button>
  );
};