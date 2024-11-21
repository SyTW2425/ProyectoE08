export const LoginButton = ({ text, className, onClick }) => {
  return (
    <button
      className={`font-poppins font-black text-2xl p-4 rounded-xl ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
