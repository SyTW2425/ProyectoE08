import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StandardButton } from '../components/assets/StandardButton';

describe('StandardButton Component', () => {
    test('renders with correct text', () => {
        render(<StandardButton text="Click Me" />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<StandardButton text="Click Me" onClick={handleClick} />);
        const button = screen.getByText('Click Me');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('applies the correct className', () => {
        render(<StandardButton text="Click Me" />);
        const button = screen.getByText('Click Me');
        expect(button).toHaveClass('bg-black/25');
        expect(button).toHaveClass('rounded-xl');
        expect(button).toHaveClass('p-2');
        expect(button).toHaveClass('hover:bg-black/50');
        expect(button).toHaveClass('shadow-md');
    });

    test('renders with default styles', () => {
        render(<StandardButton text="Click Me" />);
        const button = screen.getByText('Click Me');
        expect(button).toHaveClass('bg-black/25');
        expect(button).toHaveClass('rounded-xl');
        expect(button).toHaveClass('p-2');
        expect(button).toHaveClass('hover:bg-black/50');
        expect(button).toHaveClass('shadow-md');
    });
});