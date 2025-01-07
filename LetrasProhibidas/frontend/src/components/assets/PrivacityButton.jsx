import { useState } from "react";

export const PrivacityButton = ({ initialStatus = true, onChange }) => {
    const [isPrivate, setIsPrivate] = useState(initialStatus);

    const toggleStatus = () => {
        const newStatus = !isPrivate;
        setIsPrivate(newStatus);
        onChange(newStatus);
    };

    return (
        <div className="flex items-center">
            <span className="mr-4 text-white text-base min-w-[60px]">{isPrivate ? "Privado" : "Público"}</span>
            <button
                onClick={toggleStatus}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${isPrivate ? "bg-gray-500" : "bg-primaryBlue"
                    }`}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isPrivate ? "translate-x-1" : "translate-x-6"
                        }`}
                />
            </button>
        </div>
    );
};