import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobSearchPage from './JobSearchPage';

// Mock de la función searchJobs
vi.mock('../../context/ConexionApi', () => ({
  searchJobs: vi.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'Desarrollador React',
      company: 'Tech Company',
      location: 'Madrid',
      workMode: 'Remoto',
      salary: '30000-40000',
      description: 'Buscamos desarrollador React con experiencia',
    },
  ])),
}));

describe('JobSearchPage', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Búsqueda de Empleo/i)).toBeInTheDocument();
  });

  it('muestra el campo de búsqueda', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por título, empresa, tecnología/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('muestra los filtros principales', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Ubicación/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Modalidad/i)).toBeInTheDocument();
  });

  it('permite escribir en el campo de búsqueda', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por título, empresa, tecnología/i);
    fireEvent.change(searchInput, { target: { value: 'React' } });
    expect(searchInput.value).toBe('React');
  });

  it('muestra el botón de búsqueda', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Buscar/i)).toBeInTheDocument();
  });

  it('muestra el botón de filtros avanzados', () => {
    render(
      <BrowserRouter>
        <JobSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Filtros Avanzados/i)).toBeInTheDocument();
  });
});
