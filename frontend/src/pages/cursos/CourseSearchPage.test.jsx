import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseSearchPage from './CourseSearchPage';

// Mock de la función searchAllCourses
vi.mock('../../context/ConexionApi', () => ({
  searchAllCourses: vi.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'Curso de React',
      provider: 'Plataforma',
      category: 'Tecnología',
      level: 'Intermedio',
      mode: 'online',
      price: 'Gratis',
      description: 'Aprende React desde cero',
    },
  ])),
}));

// Mock de los datos locales
vi.mock('../../data/courses.json', () => ({
  default: [
    {
      id: '1',
      title: 'Curso de Python',
      platform: 'Udemy',
      category: 'Tecnología',
      level: 'Principiante',
      format: 'Online',
      language: 'Español',
    },
  ],
}));

// Mock de searchData
vi.mock('../../data/searchData', () => ({
  spainMunicipalities: ['Madrid', 'Barcelona', 'Valencia'],
}));

describe('CourseSearchPage', () => {
  it('se renderiza correctamente', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Búsqueda de Cursos/i)).toBeInTheDocument();
  });

  it('muestra el campo de búsqueda', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por curso, plataforma, tecnología/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('muestra los filtros principales', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Ubicación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nivel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Formato/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Certificación/i)).toBeInTheDocument();
  });

  it('permite escribir en el campo de búsqueda', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por curso, plataforma, tecnología/i);
    fireEvent.change(searchInput, { target: { value: 'React' } });
    expect(searchInput.value).toBe('React');
  });

  it('muestra el botón de búsqueda', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
  });

  it('muestra el botón de filtros avanzados', () => {
    render(
      <BrowserRouter>
        <CourseSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Filtros Avanzados/i)).toBeInTheDocument();
  });
});
