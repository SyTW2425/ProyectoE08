import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginButton } from '../components/assets/LoginButton';

describe('LoginButton Component', () => {
    it('renders with the correct text', () => {
        render(<LoginButton text="Login" />);
        const buttonElement = screen.getByText(/login/i);
        expect(buttonElement).toBeInTheDocument();
    });

    it('applies the correct className', () => {
        render(<LoginButton text="Login" className="test-class" />);
        const buttonElement = screen.getByText(/login/i);
        expect(buttonElement).toHaveClass('test-class');
    });

    it('calls the onClick handler when clicked', () => {
        const onClick = jest.fn();
        render(<LoginButton text="Login" onClick={onClick} />);
        const buttonElement = screen.getByText(/login/i);
        fireEvent.click(buttonElement);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders with default styles', () => {
        render(<LoginButton text="Login" />);
        const buttonElement = screen.getByText(/login/i);
        expect(buttonElement).toHaveClass('font-poppins');
        expect(buttonElement).toHaveClass('font-black');
        expect(buttonElement).toHaveClass('text-2xl');
        expect(buttonElement).toHaveClass('p-4');
        expect(buttonElement).toHaveClass('rounded-xl');
    });
});
