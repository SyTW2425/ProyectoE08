export const ConfirmButton = ({ text, onClick, className, type }) => {
  return (
    <button
      className={`font-poppins font-black text-lg md:text-xl lg:text-2xl p-1 md:p-2 lg:p-3 rounded-xl bg-white border-primaryPurple border-[4px] ${className}`}
      onClick={onClick}
      type={type}
    >
      <p className="text-primaryPurple">{text}</p>
    </button>
  );
};