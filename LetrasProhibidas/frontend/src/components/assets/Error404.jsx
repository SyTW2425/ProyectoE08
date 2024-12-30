import { useNavigate } from 'react-router-dom';
import { StandardButton } from './StandardButton'; // Asumiendo que tienes un componente Button personalizado

export const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-black mb-4">
                    <span className="text-white">404</span>
                    <span className="bg-gradient-to-l from-primaryBlue from-70% to-[#8ee5ff] bg-clip-text text-transparent"> - Página no encontrada</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Oops! Parece que esta página ha sido prohibida en el juego de Letras Prohibidas.
                </p>
                <div className="mb-8">
                    <svg className="mx-auto h-40 w-40 text-primaryBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className='text-white'>
                    <StandardButton text="Inicio" onClick={() => navigate('/')} />
                </div>
            </div>
        </div>
    );
};

