import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from './RegisterPage';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ register: vi.fn() }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

describe('RegisterPage', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
    expect(screen.getByText(/Crea tu cuenta en Laboria/i)).toBeInTheDocument();
  });

  it('muestra el paso 1: selección de rol', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/¿Qué tipo de cuenta necesitas?/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidato/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresa \(Empleados\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresa \(Estudiantes\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresa \(Híbrida\)/i)).toBeInTheDocument();
  });

  it('permite seleccionar un rol', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });
  });

  it('muestra el formulario de registro al seleccionar rol', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apellidos/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
    });
  });

  it('muestra campos específicos para candidato', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      expect(screen.getByLabelText(/Biografía/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Experiencia/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Expectativa salarial/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Preferencia de trabajo/i)).toBeInTheDocument();
    });
  });

  it('muestra campos específicos para empresa', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const companyRole = screen.getByText(/Empresa \(Empleados\)/i);
    fireEvent.click(companyRole);

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre de la Empresa/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Industria/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tamaño de la empresa/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Sitio web/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    });
  });

  it('valida el formato del email', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      fireEvent.blur(emailInput);

      expect(screen.getByText(/Ingresa un email válido/i)).toBeInTheDocument();
    });
  });

  it('valida que las contraseñas coincidan', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      const passwordInput = screen.getByLabelText('Contraseña');
      const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'diferente' } });
      fireEvent.blur(confirmPasswordInput);

      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('muestra los términos legales y consentimientos', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const candidateRole = screen.getByText(/Candidato/i);
    fireEvent.click(candidateRole);

    await waitFor(() => {
      expect(screen.getByText(/Términos Legales y Consentimientos/i)).toBeInTheDocument();
      expect(screen.getByText(/términos y condiciones/i)).toBeInTheDocument();
      expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument();
      expect(screen.getByText(/Preferencias de Cookies/i)).toBeInTheDocument();
    });
  });

  it('muestra los botones de navegación', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/¿Ya tienes cuenta?/i)).toBeInTheDocument();
    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Volver al inicio/i)).toBeInTheDocument();
  });

  it('tiene los estilos CSS correctos', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Qué tipo de cuenta necesitas?/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidato/i)).toBeInTheDocument();
  });
});
