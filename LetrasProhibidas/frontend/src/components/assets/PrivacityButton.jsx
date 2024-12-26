import { useState } from "react";

export const PrivacityButton = ({ initialStatus = false, onChange }) => {
    const [isPublic, setIsPublic] = useState(initialStatus);

    const toggleStatus = () => {
        const newStatus = !isPublic;
        setIsPublic(newStatus);
        onChange(newStatus);
    };

    return (
        <div className="flex items-center">
            <span className="mr-4 text-white text-base min-w-[60px]">{isPublic ? "Público" : "Privado"}</span>
            <button
                onClick={toggleStatus}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${isPublic ? "bg-primaryBlue" : "bg-gray-500"
                    }`}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isPublic ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
};