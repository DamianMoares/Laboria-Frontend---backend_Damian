import React, { useState, useEffect } from 'react';
import jobsData from '../../data/jobs.json';
import { spainMunicipalities, jobCategories, experienceLevels, contractTypes, workModes, salaryRanges } from '../../data/searchData';
import { searchAllJobs } from '../../context/ConexionApi';
import JobCard from '../../components/jobs/JobCard';
import './JobSearchPage.css';

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const RESULTS_PER_PAGE = 50;

  const locations = spainMunicipalities;
  const schedules = ['Completa', 'Parcial', 'Jornada reducida', 'Flexible'];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
    setUsingFallback(false);

    try {
      // Buscar con prioridad: Laboria → Externas → Local
      const apiResults = await searchAllJobs({
        query: searchTerm,
        location: selectedLocation,
        category: selectedCategory,
        workMode: selectedWorkMode,
        limit: RESULTS_PER_PAGE,
      });

      if (apiResults && apiResults.length > 0) {
        setJobs(apiResults);
      } else {
        // Fallback a datos locales si no hay resultados de la API
        console.warn('No se obtuvieron resultados de la API, usando datos locales');
        setUsingFallback(true);
        let filteredResults = jobsData;

        filteredResults = filteredResults.filter(job => {
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = job.title?.toLowerCase().includes(searchLower);
            const companyMatch = job.company?.toLowerCase().includes(searchLower);
            const techMatch = job.technology?.toLowerCase().includes(searchLower);
            if (!titleMatch && !companyMatch && !techMatch) {
              return false;
            }
          }

          if (selectedLocation && !job.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }

          if (selectedCategory && !job.sector?.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }

          if (selectedWorkMode && !job.workMode?.toLowerCase().includes(selectedWorkMode.toLowerCase())) {
            return false;
          }

          if (selectedExperience && !job.experienceLevel?.toLowerCase().includes(selectedExperience.toLowerCase())) {
            return false;
          }

          if (selectedContract && !job.contractType?.toLowerCase().includes(selectedContract.toLowerCase())) {
            return false;
          }

          if (selectedSchedule) {
            const scheduleMap = {
              'Completa': 'full-time',
              'Parcial': 'part-time',
              'Jornada reducida': 'part-time',
              'Flexible': 'flexible'
            };
            const expectedSchedule = scheduleMap[selectedSchedule] || selectedSchedule.toLowerCase();
            if (!job.schedule?.toLowerCase().includes(expectedSchedule)) {
              return false;
            }
          }

          if (selectedSalary) {
            const salaryNum = parseInt(job.salary?.replace(/\D/g, '')) || 0;
            const salaryMap = {
              '0 - 20000 €': [0, 20000],
              '20000 - 30000 €': [20000, 30000],
              '30000 - 40000 €': [30000, 40000],
              '40000 - 50000 €': [40000, 50000],
              '50000 - 60000 €': [50000, 60000],
              '60000+ €': [60000, Infinity]
            };
            const [min, max] = salaryMap[selectedSalary] || [0, Infinity];
            if (salaryNum < min || salaryNum > max) {
              return false;
            }
          }

          return true;
        });

        setJobs(filteredResults.slice(0, RESULTS_PER_PAGE));
      }
    } catch (err) {
      console.error('Error en búsqueda de API:', err);
      setError('Error al conectar con las APIs. Mostrando datos de ejemplo.');
      setUsingFallback(true);
      
      // Fallback a datos locales en caso de error
      let filteredResults = jobsData;
      filteredResults = filteredResults.filter(job => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const titleMatch = job.title?.toLowerCase().includes(searchLower);
          const companyMatch = job.company?.toLowerCase().includes(searchLower);
          const techMatch = job.technology?.toLowerCase().includes(searchLower);
          if (!titleMatch && !companyMatch && !techMatch) {
            return false;
          }
        }

        if (selectedLocation && !job.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        if (selectedCategory && !job.sector?.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }

        if (selectedWorkMode && !job.workMode?.toLowerCase().includes(selectedWorkMode.toLowerCase())) {
          return false;
        }

        if (selectedExperience && !job.experienceLevel?.toLowerCase().includes(selectedExperience.toLowerCase())) {
          return false;
        }

        if (selectedContract && !job.contractType?.toLowerCase().includes(selectedContract.toLowerCase())) {
          return false;
        }

        if (selectedSchedule) {
          const scheduleMap = {
            'Completa': 'full-time',
            'Parcial': 'part-time',
            'Jornada reducida': 'part-time',
            'Flexible': 'flexible'
          };
          const expectedSchedule = scheduleMap[selectedSchedule] || selectedSchedule.toLowerCase();
          if (!job.schedule?.toLowerCase().includes(expectedSchedule)) {
            return false;
          }
        }

        if (selectedSalary) {
          const salaryNum = parseInt(job.salary?.replace(/\D/g, '')) || 0;
          const salaryMap = {
            '0 - 20000 €': [0, 20000],
            '20000 - 30000 €': [20000, 30000],
            '30000 - 40000 €': [30000, 40000],
            '40000 - 50000 €': [40000, 50000],
            '50000 - 60000 €': [50000, 60000],
            '60000+ €': [60000, Infinity]
          };
          const [min, max] = salaryMap[selectedSalary] || [0, Infinity];
          if (salaryNum < min || salaryNum > max) {
            return false;
          }
        }

        return true;
      });

      setJobs(filteredResults.slice(0, RESULTS_PER_PAGE));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(jobs.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const displayedJobs = hasSearched ? jobs.slice(startIndex, endIndex) : [];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedSchedule('');
    setSelectedCategory('');
    setSelectedExperience('');
    setSelectedContract('');
    setSelectedWorkMode('');
    setSelectedSalary('');
    setHasSearched(false);
    setCurrentPage(1);
    setJobs([]);
    setError(null);
  };

  const handleApply = (jobId) => {
    alert(`Aplicando a la oferta ${jobId} (simulado - sin backend real)`);
  };

  return (
    <div className="job-search-page">
      <div className="search-header">
        <h1>Búsqueda de Empleo</h1>
        <p className="subtitle">Encuentra tu próxima oportunidad profesional en toda España</p>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por puesto, empresa, tecnología..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Buscar empleos"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="filters-sidebar">
          <h3>Filtros</h3>
          
          <div className="filter-group">
            <label htmlFor="location-filter">Ubicación:</label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map((location, index) => (
                <option key={`location-${index}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="schedule-filter">Jornada:</label>
            <select
              id="schedule-filter"
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las jornadas</option>
              {schedules.map(schedule => (
                <option key={schedule} value={schedule}>
                  {schedule}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          </button>

          {showAdvanced && (
            <div className="advanced-filters">
              <div className="filter-group">
                <label htmlFor="category-filter">Categoría:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas las categorías</option>
                  {jobCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="experience-filter">Experiencia:</label>
                <select
                  id="experience-filter"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los niveles</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="contract-filter">Tipo de contrato:</label>
                <select
                  id="contract-filter"
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los contratos</option>
                  {contractTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="workmode-filter">Modalidad:</label>
                <select
                  id="workmode-filter"
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas las modalidades</option>
                  {workModes.map(mode => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="salary-filter">Salario anual bruto:</label>
                <select
                  id="salary-filter"
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los salarios</option>
                  {salaryRanges.map(range => (
                    <option key={range} value={range}>
                      {range} €
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="filter-actions">
            <button className="btn-search" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn-clear-filters" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="results-container">
          {loading && (
            <div className="loading-state">
              <p>Buscando ofertas de empleo...</p>
            </div>
          )}

          {hasSearched && !loading && (
            <>
              {error && (
                <div className="error-state">
                  <p>{error}</p>
                </div>
              )}
              <div className="results-header">
                <span className="results-count">
                  {jobs.length} {jobs.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
                  {usingFallback && <span className="fallback-badge"> (Datos de ejemplo)</span>}
                </span>
                {totalPages > 1 && (
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                )}
              </div>

              {displayedJobs.length > 0 ? (
                <>
                  <div className="jobs-list">
                    {displayedJobs.map((job, index) => (
                      <JobCard key={job.id || `job-${index}`} job={job} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </button>
                      <div className="pagination-numbers">
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
                              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <p>No se encontraron ofertas con los filtros seleccionados.</p>
                  <p>Intenta ajustar tus criterios de búsqueda.</p>
                </div>
              )}
            </>
          )}

          {!hasSearched && !loading && (
            <div className="search-prompt">
              <p>Usa los filtros y haz clic en "Buscar" para ver ofertas de empleo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
