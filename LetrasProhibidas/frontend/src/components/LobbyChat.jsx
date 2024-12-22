export const LobbyChat = () => {
  return (
    <div className="bg-black/30 h-[400px] flex flex-col justify-between">
      {/* Contenedor de los mensajes */}
      <div className="
        flex-1 p-2
        overflow-y-scroll
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {/* Ejemplos de mensajes */}
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> ¡Hola! ¿Cómo están?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario2:</strong> ¡Hola! Todo bien, ¿y tú?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> Genial, ¿listos para jugar?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> ¡Hola! ¿Cómo están?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario2:</strong> ¡Hola! Todo bien, ¿y tú?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> Genial, ¿listos para jugar?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> ¡Hola! ¿Cómo están?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario2:</strong> ¡Hola! Todo bien, ¿y tú?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> Genial, ¿listos para jugar?
        </div>
        <div className="mb-2 p-2 rounded-lg bg-gray-800 text-white">
          <strong>Usuario1:</strong> ¡Hola! ¿Cómo están?
        </div>
        {/* Más mensajes aquí */}
      </div>

      {/* Input de mensaje */}
      <div className="p-2">
        <input
          type="text"
          className="appearance-none outline-none border-4 border-white h-12 w-full bg-white/10 rounded-xl p-1 text-sm"
          placeholder="Escribe un mensaje..."
        />
      </div>
    </div>
  );
};
