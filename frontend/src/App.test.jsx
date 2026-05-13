import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Mock del Navbar
vi.mock('./components/Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock del CookieConsent
vi.mock('./components/CookieConsent', () => ({
  default: () => <div data-testid="cookie-consent">Cookie Consent</div>,
}));

// Mock de las páginas para evitar errores de renderizado
vi.mock('./pages/inicio/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/empleos/JobSearchPage', () => ({
  default: () => <div data-testid="job-search-page">Job Search Page</div>,
}));

vi.mock('./pages/cursos/CourseSearchPage', () => ({
  default: () => <div data-testid="course-search-page">Course Search Page</div>,
}));

vi.mock('./pages/autenticacion/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/autenticacion/RegisterPage', () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock('./pages/informacion/AboutPage', () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('./pages/informacion/FAQPage', () => ({
  default: () => <div data-testid="faq-page">FAQ Page</div>,
}));

describe('App Component', () => {
  it('se renderiza correctamente', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('cookie-consent')).toBeInTheDocument();
  });

  it('muestra la página de inicio por defecto', () => {
    render(<App />);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renderiza el footer', () => {
    render(<App />);

    expect(screen.getByText(/© 2026 Laboria/i)).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });

  it('tiene la estructura CSS correcta', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByTestId('cookie-consent')).toBeInTheDocument();
  });
});
