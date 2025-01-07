import { X } from 'lucide-react'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ConfirmButton } from './assets/ConfirmButton'
import { UserInput } from './assets/UserInput'
import { useSocket } from './hooks/useSocket'

export const JoinLobby = ({
    isOpen,
    onClose,
    title,
    showCloseButton = true,
    buttonText = "VALE",
}) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const [inputValue, setInputValue] = useState("") // Estado para el texto ingresado
    const upperTitle = title.toUpperCase()
    const navigate = useNavigate()
    const { socket } = useSocket()
    const userID = localStorage.getItem("userID")
    const userName = localStorage.getItem("userName")
    const userAvatar = localStorage.getItem("userAvatar")

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [onClose])

    // Accionar handleButtonClick con tecla Enter
    useEffect(() => {
        const handleEnter = (e) => {
            if (e.key === 'Enter') handleButtonClick()
        }

        window.addEventListener('keydown', handleEnter)
        return () => window.removeEventListener('keydown', handleEnter)
    }, [inputValue])

    if (!isOpen && !isAnimating) return null

    const handleButtonClick = () => {
        if (inputValue.trim()) { // Navegar solo si el valor no está vacío
            socket.emit("joinLobby", { lobbyID: inputValue.trim(), userID, userName, userAvatar })
            navigate(`/lobby/${inputValue.trim()}`)
        } else {
            alert("Por favor ingresa un texto antes de continuar.")
        }
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-lg rounded-2xl bg-[#1a1040] p-6 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100/10 hover:text-white transition-colors duration-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">
                        <span className="text-white">{upperTitle.split(' ')[0]} </span>
                        <span className="text-primaryBlue">
                            {upperTitle.split(' ').slice(1).join(' ')}
                        </span>
                    </h2>

                    <div className="m-4 text-gray-100">
                        <UserInput type={"text"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    </div>

                    <ConfirmButton
                        text={buttonText}
                        onClick={handleButtonClick}
                        className="pl-2 pr-2"
                    />
                </div>
            </div>
        </div>
    )
}
