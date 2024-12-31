export const UserInput = ({ text, type, value, onChange, placeholder = "Escribe aquí..." }) => {
  return (
    <label className="mb-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
      {text &&
        <p className="mb-2 text-white text-sm font-semibold">{text}</p>
      }
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="appearance-none outline-none border-4 border-white h-12 w-full bg-white/10 rounded-xl p-1 text-sm"
      />
    </label>
  );
};