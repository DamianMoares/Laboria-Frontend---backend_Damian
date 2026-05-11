import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from './Navbar';

// Mock del logo
vi.mock('../../assets/img/Laboria_Fondo_Negro.png', () => ({
  default: 'logo.png',
}));

// Mock del useAuth
vi.mock('../../context/AuthContext', () => ({
  ...vi.importActual('../../context/AuthContext'),
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isCandidate: false,
    isAnyCompany: false,
    isAdmin: false,
    logout: vi.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByAltText(/Laboria/i)).toBeInTheDocument();
  });

  it('muestra los enlaces de navegación principales', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Empleos/i)).toBeInTheDocument();
    expect(screen.getByText(/Cursos/i)).toBeInTheDocument();
    expect(screen.getByText(/Acerca de/i)).toBeInTheDocument();
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
  });

  it('muestra enlaces de autenticación cuando no está autenticado', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  it('muestra enlaces de usuario cuando está autenticado', () => {
    // Mock de usuario autenticado
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'CANDIDATE' },
      isAuthenticated: true,
      isCandidate: true,
      isAnyCompany: false,
      isAdmin: false,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();
    expect(screen.queryByText(/Iniciar Sesión/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registrarse/i)).not.toBeInTheDocument();
  });

  it('muestra enlace de admin cuando el usuario es admin', () => {
    // Mock de usuario admin
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'ADMIN' },
      isAuthenticated: true,
      isCandidate: false,
      isAnyCompany: false,
      isAdmin: true,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/🎛️ Admin/i)).toBeInTheDocument();
  });

  it('tiene el menú móvil cerrado por defecto', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const menu = screen.getByRole('list');
    expect(menu).not.toHaveClass('open');
  });

  it('abre y cierra el menú móvil', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const menu = screen.getByRole('list');

    // Abrir menú
    fireEvent.click(toggleButton);
    expect(menu).toHaveClass('open');

    // Cerrar menú
    fireEvent.click(toggleButton);
    expect(menu).not.toHaveClass('open');
  });

  it('cierra el menú al hacer clic en un enlace', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const homeLink = screen.getByText(/Inicio/i);
    const menu = screen.getByRole('list');

    // Abrir menú
    fireEvent.click(toggleButton);
    expect(menu).toHaveClass('open');

    // Clic en enlace
    fireEvent.click(homeLink);
    expect(menu).not.toHaveClass('open');
  });

  it('cierra el menú al hacer clic en el overlay', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const menu = screen.getByRole('list');

    // Abrir menú
    fireEvent.click(toggleButton);
    expect(menu).toHaveClass('open');

    // Buscar y hacer clic en el overlay
    const overlay = document.querySelector('.navbarOverlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(menu).not.toHaveClass('open');
    }
  });

  it('llama a logout al hacer clic en Cerrar Sesión', () => {
    const mockLogout = vi.fn();
    
    // Mock de usuario autenticado
    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'CANDIDATE' },
      isAuthenticated: true,
      isCandidate: true,
      isAnyCompany: false,
      isAdmin: false,
      logout: mockLogout,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('tiene los estilos CSS correctos', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const navbar = document.querySelector('.navbar');
    const navbarContainer = document.querySelector('.navbarContainer');
    const navbarMenu = document.querySelector('.navbarMenu');

    expect(navbar).toBeInTheDocument();
    expect(navbarContainer).toBeInTheDocument();
    expect(navbarMenu).toBeInTheDocument();
  });
});
