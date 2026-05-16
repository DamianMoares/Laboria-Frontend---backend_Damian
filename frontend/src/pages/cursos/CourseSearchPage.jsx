import React, { useState, useEffect, useCallback } from 'react';
import coursesData from '../../data/courses.json';
import { spainMunicipalities } from '../../data/searchData';
import { searchAllCourses } from '../../context/ConexionApi';
import CourseCard from '../../components/courses/CourseCard';
import styles from './CourseSearchPage.module.css';

const CourseSearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedCertification, setSelectedCertification] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const RESULTS_PER_PAGE = 50;

  const locations = spainMunicipalities;
  const levels = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];
  const formats = ['Online', 'Presencial', 'Híbrido'];
  const categories = ['Tecnología', 'Negocios', 'Diseño', 'Marketing', 'Salud', 'Educación', 'Idiomas', 'Finanzas', 'Arte', 'Ciencia', 'Ingeniería', 'Otros'];
  const languages = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Catalán', 'Euskera', 'Gallego', 'Chino', 'Japonés', 'Otros'];
  const priceRanges = ['Gratis', '0 - 50 €', '50 - 100 €', '100 - 200 €', '200 - 500 €', '500+ €'];
  const durations = ['< 10 horas', '10 - 30 horas', '30 - 60 horas', '60 - 100 horas', '100+ horas'];

  // Debounce para búsqueda en tiempo real
  const debouncedSearch = useCallback((searchValue) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      if (searchValue.trim() !== '') {
        handleSearch();
      }
    }, 500); // 500ms de debounce

    setDebounceTimer(newTimer);
  }, [debounceTimer, searchTerm, selectedCategory, selectedLevel, selectedFormat, selectedLocation, selectedLanguage]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
    setUsingFallback(false);

    try {
      // Buscar con prioridad: Laboria → Externas → Local
      const apiResults = await searchAllCourses({
        query: searchTerm,
        category: selectedCategory,
        level: selectedLevel,
        mode: selectedFormat,
        limit: RESULTS_PER_PAGE,
      });

      if (apiResults && apiResults.length > 0) {
        setCourses(apiResults);
      } else {
        // Fallback a datos locales si no hay resultados de la API
        console.warn('No se obtuvieron resultados de la API, usando datos locales');
        setUsingFallback(true);
        let filteredResults = coursesData;

        filteredResults = filteredResults.filter(course => {
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = course.title?.toLowerCase().includes(searchLower);
            const platformMatch = course.platform?.toLowerCase().includes(searchLower);
            const techMatch = course.technology?.toLowerCase().includes(searchLower);
            if (!titleMatch && !platformMatch && !techMatch) {
              return false;
            }
          }

          if (selectedLocation && !course.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }

          if (selectedCategory && !course.category?.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }

          if (selectedLevel && !course.level?.toLowerCase().includes(selectedLevel.toLowerCase())) {
            return false;
          }

          if (selectedFormat && !course.format?.toLowerCase().includes(selectedFormat.toLowerCase())) {
            return false;
          }

          if (selectedLanguage && !course.language?.toLowerCase().includes(selectedLanguage.toLowerCase())) {
            return false;
          }

          if (selectedCertification) {
            const hasCertification = selectedCertification === 'certified';
            if (course.certification !== hasCertification) {
              return false;
            }
          }

          if (selectedPrice) {
            const priceLower = course.price?.toLowerCase() || '';
            if (selectedPrice === 'Gratis') {
              if (!priceLower.includes('gratis') && !priceLower.includes('free')) {
                return false;
              }
            } else {
              const priceNum = parseFloat(course.price?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
              const priceMap = {
                '0 - 50 €': [0, 50],
                '50 - 100 €': [50, 100],
                '100 - 200 €': [100, 200],
                '200 - 500 €': [200, 500],
                '500+ €': [500, Infinity]
              };
              const [min, max] = priceMap[selectedPrice] || [0, Infinity];
              if (priceNum < min || priceNum > max) {
                return false;
              }
            }
          }

          if (selectedDuration) {
            const durationLower = course.duration?.toLowerCase() || '';
            const durationMap = {
              '< 10 horas': [0, 10],
              '10 - 30 horas': [10, 30],
              '30 - 60 horas': [30, 60],
              '60 - 100 horas': [60, 100],
              '100+ horas': [100, Infinity]
            };
            const [min, max] = durationMap[selectedDuration] || [0, Infinity];
            const durationNum = parseFloat(durationLower.replace(/[^\d]/g, '')) || 0;
            if (durationNum < min || durationNum > max) {
              return false;
            }
          }

          return true;
        });

        setCourses(filteredResults.slice(0, RESULTS_PER_PAGE));
      }
    } catch (err) {
      console.error('Error en búsqueda de API:', err);
      setError('Error al conectar con las APIs. Mostrando datos de ejemplo.');
      setUsingFallback(true);

      // Fallback a datos locales en caso de error
      let filteredResults = coursesData;
      filteredResults = filteredResults.filter(course => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const titleMatch = course.title?.toLowerCase().includes(searchLower);
          const platformMatch = course.platform?.toLowerCase().includes(searchLower);
          const techMatch = course.technology?.toLowerCase().includes(searchLower);
          if (!titleMatch && !platformMatch && !techMatch) {
            return false;
          }
        }

        if (selectedLocation && !course.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        if (selectedCategory && !course.category?.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }

        if (selectedLevel && !course.level?.toLowerCase().includes(selectedLevel.toLowerCase())) {
          return false;
        }

        if (selectedFormat && !course.format?.toLowerCase().includes(selectedFormat.toLowerCase())) {
          return false;
        }

        if (selectedLanguage && !course.language?.toLowerCase().includes(selectedLanguage.toLowerCase())) {
            return false;
          }

          if (selectedCertification) {
            const hasCertification = selectedCertification === 'certified';
            if (course.certification !== hasCertification) {
              return false;
            }
          }

          if (selectedPrice) {
            const priceLower = course.price?.toLowerCase() || '';
            if (selectedPrice === 'Gratis') {
              if (!priceLower.includes('gratis') && !priceLower.includes('free')) {
                return false;
              }
            } else {
              const priceNum = parseFloat(course.price?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
              const priceMap = {
                '0 - 50 €': [0, 50],
                '50 - 100 €': [50, 100],
                '100 - 200 €': [100, 200],
                '200 - 500 €': [200, 500],
                '500+ €': [500, Infinity]
              };
              const [min, max] = priceMap[selectedPrice] || [0, Infinity];
              if (priceNum < min || priceNum > max) {
                return false;
              }
            }
          }

          if (selectedDuration) {
            const durationLower = course.duration?.toLowerCase() || '';
            const durationMap = {
              '< 10 horas': [0, 10],
              '10 - 30 horas': [10, 30],
              '30 - 60 horas': [30, 60],
              '60 - 100 horas': [60, 100],
              '100+ horas': [100, Infinity]
            };
            const [min, max] = durationMap[selectedDuration] || [0, Infinity];
            const durationNum = parseFloat(durationLower.replace(/[^\d]/g, '')) || 0;
            if (durationNum < min || durationNum > max) {
              return false;
            }
          }

          return true;
      });

      setCourses(filteredResults.slice(0, RESULTS_PER_PAGE));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(courses.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const displayedCourses = hasSearched ? courses.slice(startIndex, endIndex) : [];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedLevel('');
    setSelectedFormat('');
    setSelectedCertification('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedPrice('');
    setSelectedDuration('');
    setHasSearched(false);
    setCurrentPage(1);
    setCourses([]);
    setError(null);
  };

  return (
    <div className={styles['course-search-page']}>
      <div className={styles['search-header']}>
        <h1>Búsqueda de Cursos</h1>
        <p className={styles['subtitle']}>Mejora tus habilidades con formación profesional en toda España</p>
      </div>

      <div className={styles['search-container']}>
        <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="Buscar por curso, plataforma, tecnología..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['search-input']}
            aria-label="Buscar cursos"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className={styles['filters-sidebar']}>
          <h3>Filtros</h3>
          
          <div className={styles['filter-group']}>
            <label htmlFor="location-filter">Ubicación:</label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="level-filter">Nivel:</label>
            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="">Todos los niveles</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="format-filter">Formato:</label>
            <select
              id="format-filter"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="">Todos los formatos</option>
              {formats.map(format => (
                <option key={format} value={format}>
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="certification-filter">Certificación:</label>
            <select
              id="certification-filter"
              value={selectedCertification}
              onChange={(e) => setSelectedCertification(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="">Todos</option>
              <option value="certified">Con certificación</option>
              <option value="non-certified">Sin certificación</option>
            </select>
          </div>

          <button
            className={styles['btn-toggle-advanced']}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          </button>

          {showAdvanced && (
            <div className={styles['advanced-filters']}>
              <div className={styles['filter-group']}>
                <label htmlFor="category-filter">Categoría:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles['filter-group']}>
                <label htmlFor="language-filter">Idioma:</label>
                <select
                  id="language-filter"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">Todos los idiomas</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles['filter-group']}>
                <label htmlFor="price-filter">Precio:</label>
                <select
                  id="price-filter"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">Todos los precios</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles['filter-group']}>
                <label htmlFor="duration-filter">Duración:</label>
                <select
                  id="duration-filter"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">Todas las duraciones</option>
                  {durations.map(duration => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className={styles['filter-actions']}>
            <button className={styles['btn-search']} onClick={handleSearch}>
              Buscar
            </button>
            <button className={styles['btn-clear-filters']} onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className={styles['results-container']}>
          {loading && (
            <div className={styles['loading-state']}>
              <p>Buscando cursos...</p>
            </div>
          )}

          {hasSearched && !loading && (
            <>
              {error && (
                <div className={styles['error-state']}>
                  <p>{error}</p>
                </div>
              )}
              <div className={styles['results-header']}>
                <span className={styles['results-count']}>
                  {courses.length} {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
                  {usingFallback && <span className={styles['fallback-badge']}> (Datos de ejemplo)</span>}
                </span>
                {totalPages > 1 && (
                  <span className={styles['pagination-info']}>
                    Página {currentPage} de {totalPages}
                  </span>
                )}
              </div>

              {displayedCourses.length > 0 ? (
                <>
                  <div className={styles['courses-list']}>
                    {displayedCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className={styles['pagination']}>
                      <button
                        className={styles['pagination-btn']}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </button>
                      <div className={styles['pagination-numbers']}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              className={styles['pagination-number'] + ' ' + (currentPage === pageNum ? styles['active'] : '')}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        className={styles['pagination-btn']}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles['no-results']}>
                  <p>No se encontraron cursos con los filtros seleccionados.</p>
                  <p>Intenta ajustar tus criterios de búsqueda.</p>
                </div>
              )}
            </>
          )}

          {!hasSearched && !loading && (
            <div className={styles['search-prompt']}>
              <p>Usa los filtros y haz clic en "Buscar" para ver cursos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSearchPage;
