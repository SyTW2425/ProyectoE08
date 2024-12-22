import { useState } from "react"

export const CopyToClipboard = ({toCopy}) => {
  const handleClick = async () => {
    try {
      navigator.clipboard.writeText(toCopy)
      setButtonText("Copiado")
      setTimeout(() => setButtonText("Copiar código"), 1000)
    } catch (err) {
      console.log(err)
    }
  }

  const [buttonText, setButtonText] = useState("Copiar código")

  return (
    <button className="bg-black/25 rounded-xl p-2 hover:bg-black/50" onClick={handleClick}>
      {buttonText}
    </button>
  )
}