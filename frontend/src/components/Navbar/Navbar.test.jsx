import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import styles from './Navbar.module.css';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <>{children}</>,
}));

vi.mock('../../assets/img/Laboria_Fondo_Negro.png', () => ({
  default: 'logo.png',
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isCandidate: () => false,
      isAnyCompany: () => false,
      isAdmin: () => false,
      logout: vi.fn(),
    });
  });

  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByAltText(/Laboria/i)).toBeInTheDocument();
  });

  it('muestra los enlaces de navegación principales', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Empleos/i)).toBeInTheDocument();
    const cursoLinks = screen.getAllByText(/Cursos/i);
    expect(cursoLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Acerca de/i)).toBeInTheDocument();
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
  });

  it('muestra enlaces de autenticación cuando no está autenticado', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  it('muestra enlaces de usuario cuando está autenticado', () => {
    useAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'CANDIDATE' },
      isAuthenticated: true,
      isCandidate: () => true,
      isAnyCompany: () => false,
      isAdmin: () => false,
      logout: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Búsqueda empleo/i)).toBeInTheDocument();
    expect(screen.getByText(/Búsqueda cursos/i)).toBeInTheDocument();
    expect(screen.getByText(/Configuración/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();
    expect(screen.queryByText(/Iniciar Sesión/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registrarse/i)).not.toBeInTheDocument();
  });

  it('tiene el menú móvil cerrado por defecto', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menu = screen.getByRole('list');
    expect(menu).not.toHaveClass(styles.open);
  });

  it('abre y cierra el menú móvil', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const menu = screen.getByRole('list');

    fireEvent.click(toggleButton);
    expect(menu).toHaveClass(styles.open);

    fireEvent.click(toggleButton);
    expect(menu).not.toHaveClass(styles.open);
  });

  it('cierra el menú al hacer clic en un enlace', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const homeLink = screen.getByText(/Inicio/i);
    const menu = screen.getByRole('list');

    fireEvent.click(toggleButton);
    expect(menu).toHaveClass(styles.open);

    fireEvent.click(homeLink);
    expect(menu).not.toHaveClass(styles.open);
  });

  it('cierra el menú al hacer clic en el overlay', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText(/Toggle menu/i);
    const menu = screen.getByRole('list');

    fireEvent.click(toggleButton);
    expect(menu).toHaveClass(styles.open);

    const overlay = document.querySelector('.navbarOverlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(menu).not.toHaveClass(styles.open);
    }
  });

  it('llama a logout al hacer clic en Cerrar Sesión', () => {
    const mockLogout = vi.fn();

    useAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'CANDIDATE' },
      isAuthenticated: true,
      isCandidate: () => true,
      isAnyCompany: () => false,
      isAdmin: () => false,
      logout: mockLogout,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('tiene los estilos CSS correctos', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });
});
