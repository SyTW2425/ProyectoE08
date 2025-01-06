import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Timer } from '../components/assets/Timer';

describe('Timer Component', () => {
    test('renders with correct time left', () => {
        render(<Timer timeLeft={10} />);
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    test('renders "¡Fin!" when timeLeft is 0', () => {
        render(<Timer timeLeft={0} />);
        expect(screen.getByText('¡Fin!')).toBeInTheDocument();
    });


    test('renders with red text when timeLeft is 5 or less', () => {
        render(<Timer timeLeft={5} />);
        const span = screen.getByText('5');
        expect(span).toHaveClass('text-red-500');
    });

    test('renders with white text when timeLeft is more than 5', () => {
        render(<Timer timeLeft={10} />);
        const span = screen.getByText('10');
        expect(span).toHaveClass('text-white');
    });
});