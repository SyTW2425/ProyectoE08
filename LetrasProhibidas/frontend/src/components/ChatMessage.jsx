export const ChatMessage = ({text, sender}) => {
  return (
    <div className="flex flex-col p-2 max-w-80 w-full">
      <h1 className="text-primaryBlue text-sm">{sender.toUpperCase()}</h1>
      <p className="whitespace-normal break-words">{text}</p>
    </div>
  )
}