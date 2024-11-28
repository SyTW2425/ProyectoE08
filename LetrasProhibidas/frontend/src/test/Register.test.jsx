import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { Register } from '../components/Register';

describe('Register Component', () => {
    const mockOnRegister = jest.fn();

    beforeEach(() => {
        render(<Register onRegister={mockOnRegister} />);
    });

    test('renders Register component', () => {
        expect(screen.getByText('CORREO ELECTRÓNICO')).toBeInTheDocument();
        expect(screen.getByText('NOMBRE DE USUARIO')).toBeInTheDocument();
        expect(screen.getByText('CONTRASEÑA')).toBeInTheDocument();
        expect(screen.getByText('VALE')).toBeInTheDocument();
    });

    test('shows error message when fields are empty', () => {
        fireEvent.click(screen.getByText('VALE'));
        expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
    });

    test('shows error message for invalid email', () => {
        fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('NOMBRE DE USUARIO'), { target: { value: 'username' } });
        fireEvent.change(screen.getByLabelText('CONTRASEÑA'), { target: { value: 'Password1' } });
        fireEvent.click(screen.getByText('VALE'));
        expect(screen.getByText('El correo electrónico no es válido.')).toBeInTheDocument();
    });

    test('shows error message for short password', () => {
        fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('NOMBRE DE USUARIO'), { target: { value: 'username' } });
        fireEvent.change(screen.getByLabelText('CONTRASEÑA'), { target: { value: 'short' } });
        fireEvent.click(screen.getByText('VALE'));
        expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });

    test('shows error message for invalid password', () => {
        fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('NOMBRE DE USUARIO'), { target: { value: 'username' } });
        fireEvent.change(screen.getByLabelText('CONTRASEÑA'), { target: { value: 'password' } });
        fireEvent.click(screen.getByText('VALE'));
        expect(screen.getByText('La contraseña debe contener al menos una letra mayuscula y un número.')).toBeInTheDocument();
    });

    test('calls onRegister with valid inputs', () => {
        fireEvent.change(screen.getByLabelText('CORREO ELECTRÓNICO'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('NOMBRE DE USUARIO'), { target: { value: 'username' } });
        fireEvent.change(screen.getByLabelText('CONTRASEÑA'), { target: { value: 'Password1' } });
        fireEvent.click(screen.getByText('VALE'));
        expect(mockOnRegister).toHaveBeenCalledWith({ email: 'test@example.com', name: 'username', password: 'Password1' });
    });
});