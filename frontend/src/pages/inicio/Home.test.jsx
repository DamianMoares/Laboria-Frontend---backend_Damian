import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock de la función getTotalJobsCount
vi.mock('../../context/ConexionApi', () => ({
  getTotalJobsCount: vi.fn(() => Promise.resolve(1500)),
  getTotalCoursesCount: vi.fn(() => Promise.resolve(1850)),
}));

describe('Home Page', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verificar que el título principal esté presente
    expect(screen.getByText(/Laboria/i)).toBeInTheDocument();
  });

  it('muestra el subtítulo del portal', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tu portal de empleo y formación profesional en España/i)).toBeInTheDocument();
  });

  it('muestra los botones de navegación principales', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Buscar Empleo/i)).toBeInTheDocument();
    expect(screen.getByText(/Buscar Cursos/i)).toBeInTheDocument();
  });

  it('muestra las secciones de características', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/¿Por qué Laboria?/i)).toBeInTheDocument();
    expect(screen.getByText(/Empleo/i)).toBeInTheDocument();
    expect(screen.getByText(/Formación/i)).toBeInTheDocument();
  });

  it('muestra las estadísticas', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Ofertas de empleo/i)).toBeInTheDocument();
    expect(screen.getByText(/Cursos disponibles/i)).toBeInTheDocument();
  });

  it('muestra la sección de llamada a la acción', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/¿Listo para dar el siguiente paso?/i)).toBeInTheDocument();
  });
});
