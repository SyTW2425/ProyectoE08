export const LoginButton = ({ text, className, onClick }) => {
  return (
    <button
      className={`font-poppins font-black text-lg sm:text-xl md:text-2xl p-2 sm:p-3 md:p-4 rounded-xl ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
