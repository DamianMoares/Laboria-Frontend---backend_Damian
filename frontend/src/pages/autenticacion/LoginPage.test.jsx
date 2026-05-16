import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from './LoginPage';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

describe('LoginPage', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Iniciar Sesión/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Accede a tu cuenta de Laboria/i)).toBeInTheDocument();
  });

  it('muestra el formulario de login', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('muestra los enlaces de navegación', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/¿No tienes cuenta?/i)).toBeInTheDocument();
    expect(screen.getByText(/Regístrate/i)).toBeInTheDocument();
    expect(screen.getByText(/Volver al inicio/i)).toBeInTheDocument();
  });

  it('permite escribir en los campos del formulario', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('valida el formato del email', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/Ingresa un email válido/i)).toBeInTheDocument();
    });
  });

  it('valida que la contraseña tenga al menos 6 caracteres', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('muestra error si los campos están vacíos al enviar', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Por favor corrige los errores del formulario/i)).toBeInTheDocument();
    });
  });

  it('tiene los estilos CSS correctos', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Iniciar Sesión/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });
});
