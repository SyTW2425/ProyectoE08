import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserInput } from '../components/assets/UserInput';

describe('UserInput Component', () => {
    test('renders the UserInput component with correct text', () => {
        render(<UserInput text="Nombre" type="text" value="" onChange={() => {}} />);
        expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    test('renders the input element with correct type', () => {
        render(<UserInput text="Nombre" type="text" value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Escribe aquí...')).toHaveAttribute('type', 'text');
    });

    test('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        render(<UserInput text="Nombre" type="text" value="" onChange={handleChange} />);
        fireEvent.change(screen.getByPlaceholderText('Escribe aquí...'), { target: { value: 'Nuevo valor' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('renders the input element with correct value', () => {
        render(<UserInput text="Nombre" type="text" value="Valor inicial" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Escribe aquí...')).toHaveValue('Valor inicial');
    });
});