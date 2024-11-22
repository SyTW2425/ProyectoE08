export const UserInput = ({ text, type, value, onChange }) => {
  return (
    <label className="mb-4">
      <p className="mb-2 text-white text-sm font-semibold">{text}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder="Escribe aquí..."
        className="appearance-none outline-none border-4 border-white h-12 max-w-60 min-w-56 bg-white/10 rounded-xl p-1 text-sm"
      />
    </label>
  );
};