import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginPage } from '../components/pages/LoginPage';

describe('LoginPage Component', () => {
  it('should render the LoginPage component correctly', () => {
    render(<LoginPage onLogin={jest.fn()} onRegister={jest.fn()} />);
    
    // Verificar elementos principales
    // expect(screen.getByText(/LETRAS PROHIBIDAS/i)).toBeInTheDocument();
    expect(screen.getByText(/¿CÓMO JUGAR?/i)).toBeInTheDocument();
    expect(screen.getByText(/¡El reto es simple!/i)).toBeInTheDocument();
    expect(screen.getByText(/INICIA SESION/i)).toBeInTheDocument();
    expect(screen.getByText(/REGISTRATE/i)).toBeInTheDocument();
  });

  it('should toggle between Login and Register views', () => {
    render(<LoginPage onLogin={jest.fn()} onRegister={jest.fn()} />);
    
    const loginButton = screen.getByText(/INICIA SESION/i);
    const registerButton = screen.getByText(/REGISTRATE/i);

    // Inicialmente debe mostrar el formulario de Login
    expect(screen.getByText(/Inicia sesion/i)).toBeInTheDocument(); // Cambia si el texto de Login tiene otro título

    // Hacer clic en "REGISTRATE" y verificar el cambio
    fireEvent.click(registerButton);
    expect(screen.getByText(/VALE/i)).toBeInTheDocument(); // Cambia si el texto de Register tiene otro título
    expect(screen.getByText(/CORREO ELECTRÓNICO/i)).toBeInTheDocument(); // Cambia si el texto de Register tiene otro título
    expect(screen.getByText(/NOMBRE DE USUARIO/i)).toBeInTheDocument(); // Cambia si el texto de Register tiene otro título
    expect(screen.getByText(/CONTRASEÑA/i)).toBeInTheDocument(); // Cambia si el texto de Register tiene otro título

    expect(screen.queryByText(/¡JUGAR!/i)).not.toBeInTheDocument();

    // Volver a "INICIA SESION" y verificar
    fireEvent.click(loginButton);
    expect(screen.getByText(/NOMBRE DE USUARIO/i)).toBeInTheDocument();
    expect(screen.getByText(/CONTRASEÑA/i)).toBeInTheDocument();
    expect(screen.queryByText(/Registrarse/i)).not.toBeInTheDocument();
  });

  it('should call onLogin and onRegister when respective actions are performed', () => {
    const onLoginMock = jest.fn();
    const onRegisterMock = jest.fn();

    render(<LoginPage onLogin={onLoginMock} onRegister={onRegisterMock} />);
    
    const loginButton = screen.getByText(/INICIA SESION/i);
    const registerButton = screen.getByText(/REGISTRATE/i);

    // Simular la acción de login
    fireEvent.click(loginButton);
    fireEvent.change(screen.getByLabelText(/NOMBRE DE USUARIO/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/CONTRASEÑA/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/¡JUGAR!/i)); // Update to match actual button text
    expect(onLoginMock).toHaveBeenCalledTimes(1);

    // Simular la acción de registro
    fireEvent.click(registerButton);
    fireEvent.change(screen.getByLabelText(/CORREO ELECTRÓNICO/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/NOMBRE DE USUARIO/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/CONTRASEÑA/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/VALE/i)); // Update to match actual button text
    expect(onRegisterMock).toHaveBeenCalledTimes(1);
  });
});
