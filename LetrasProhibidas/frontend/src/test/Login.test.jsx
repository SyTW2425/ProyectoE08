import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from '../components/Login';

describe('Login Component', () => {
    const mockOnLogin = jest.fn();

    beforeEach(() => {
        render(<Login onLogin={mockOnLogin} />);
    });

    test('renders username and password inputs', () => {
        expect(screen.getByLabelText(/NOMBRE DE USUARIO/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/CONTRASEÑA/i)).toBeInTheDocument();
    });

    test('renders confirm button', () => {
        expect(screen.getByText(/¡JUGAR!/i)).toBeInTheDocument();
    });

    test('shows error message when inputs are empty', async () => {
        fireEvent.click(screen.getByText(/¡JUGAR!/i));
        expect(await screen.findByText(/Todos los campos son obligatorios./i)).toBeInTheDocument();
    });

    test('calls onLogin with username and password', async () => {
        fireEvent.change(screen.getByLabelText(/NOMBRE DE USUARIO/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/CONTRASEÑA/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByText(/¡JUGAR!/i));
        expect(mockOnLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    });

    test('shows error message on login failure', async () => {
        mockOnLogin.mockRejectedValueOnce(new Error('Login failed'));
        fireEvent.change(screen.getByLabelText(/NOMBRE DE USUARIO/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/CONTRASEÑA/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByText(/¡JUGAR!/i));
        expect(await screen.findByText(/Usuario o contraseña incorrectos./i)).toBeInTheDocument();
    });
});