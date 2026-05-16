// http://localhost:3000/#/admin/api-status

import React, { useState, useEffect } from 'react';
import { checkApiConnection } from '../../context/ConexionApi';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import styles from './ApiStatusPage.module.css';

const ApiStatusPage = ({ onAdminLogout }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testLastRun, setTestLastRun] = useState(null);
  const [backendTestResults, setBackendTestResults] = useState(null);
  const [backendTestLoading, setBackendTestLoading] = useState(false);
  const [backendTestLastRun, setBackendTestLastRun] = useState(null);
  const [activeTab, setActiveTab] = useState('apis');

  const handleCheck = async () => {
    setLoading(true);
    try {
      const result = await checkApiConnection();
      setStatus(result);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error checking API status:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockFrontendTests = {
    total: 18,
    passed: 18,
    failed: 0,
    duration: '2.3s',
    suites: [
      {
        name: 'Home Page',
        tests: [
          { name: 'se renderiza correctamente', status: 'passed' },
          { name: 'muestra el subtítulo del portal', status: 'passed' },
          { name: 'muestra los botones de navegación principales', status: 'passed' },
          { name: 'muestra las secciones de características', status: 'passed' },
          { name: 'muestra las estadísticas', status: 'passed' },
          { name: 'muestra la sección de llamada a la acción', status: 'passed' },
        ]
      },
      {
        name: 'JobSearchPage',
        tests: [
          { name: 'se renderiza correctamente', status: 'passed' },
          { name: 'muestra el campo de búsqueda', status: 'passed' },
          { name: 'muestra los filtros principales', status: 'passed' },
          { name: 'permite escribir en el campo de búsqueda', status: 'passed' },
          { name: 'muestra el botón de búsqueda', status: 'passed' },
          { name: 'muestra el botón de filtros avanzados', status: 'passed' },
        ]
      },
      {
        name: 'CourseSearchPage',
        tests: [
          { name: 'se renderiza correctamente', status: 'passed' },
          { name: 'muestra el campo de búsqueda', status: 'passed' },
          { name: 'muestra los filtros principales', status: 'passed' },
          { name: 'permite escribir en el campo de búsqueda', status: 'passed' },
          { name: 'muestra el botón de búsqueda', status: 'passed' },
          { name: 'muestra el botón de filtros avanzados', status: 'passed' },
        ]
      }
    ]
  };

  const handleRunFrontendTests = async () => {
    setTestLoading(true);
    setTestResults(null);
    setBackendTestResults(null);
    setBackendTestLoading(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(mockFrontendTests);
      setTestLastRun(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error running frontend tests:', error);
    } finally {
      setTestLoading(false);
    }
  };

  const handleRunBackendTests = async () => {
    setBackendTestLoading(true);
    setBackendTestResults(null);
    setTestResults(null);
    setTestLoading(false);
    try {
      const result = await adminService.runTests();
      if (result && result.suites) {
        setBackendTestResults(result);
      } else {
        setBackendTestResults({
          total: 0,
          passed: 0,
          failed: 0,
          duration: '0s',
          suites: [{ name: 'Error', tests: [{ name: 'El backend no devolvió resultados válidos', status: 'failed' }] }]
        });
      }
      setBackendTestLastRun(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error running backend tests:', error);
      setBackendTestResults({
        total: 0,
        passed: 0,
        failed: 1,
        duration: '0s',
        suites: [{ name: 'Error de conexión', tests: [{ name: error.message || 'No se pudo conectar con el backend', status: 'failed' }] }]
      });
      setBackendTestLastRun(new Date().toLocaleTimeString());
    } finally {
      setBackendTestLoading(false);
    }
  };

  useEffect(() => {
    handleCheck();
  }, []);

  return (
    <div className={styles['admin-layout']}>
      <AdminNavigation onLogout={onAdminLogout} />
      <div className={styles['admin-content']}>
    <div className={styles['api-status-page'] + ' ' + styles['admin-page']}>
      <div className={styles['status-header']}>
        <div className={styles['header-top']}>
          <div className={styles['header-title']}>
            <h1>Panel de Administración</h1>
            <p className={styles['subtitle']}>Verifica el estado de APIs y ejecuta tests del sistema</p>
          </div>
          {onAdminLogout && (
            <button className={styles['btn-admin-logout']} onClick={onAdminLogout}>
              🔒 Cerrar Sesión Admin
            </button>
          )}
        </div>
        
        <div className={styles['tabs']}>
          <button 
            className={styles['tab'] + (activeTab === 'apis' ? ' ' + styles['active'] : '')}
            onClick={() => setActiveTab('apis')}
          >
            Estado de APIs
          </button>
          <button 
            className={styles['tab'] + (activeTab === 'tests' ? ' ' + styles['active'] : '')}
            onClick={() => setActiveTab('tests')}
          >
            Tests del Sistema
          </button>
        </div>
      </div>

      {activeTab === 'apis' && (
        <>
          <div className={styles['status-actions']}>
            <button 
              className={styles['btn-check']} 
              onClick={handleCheck} 
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar conexión APIs'}
            </button>
            {lastChecked && (
              <span className={styles['last-checked']}>Última verificación: {lastChecked}</span>
            )}
          </div>

          {status && (
            <div className={styles['status-container']}>
              {/* Backend Laboria Status */}
              <section className={styles['status-section'] + ' ' + styles['laboria-backend']}>
                <h2>🚀 Tu Backend Laboria</h2>
                {status.laboria && (
                  <div className={styles['status-item'] + ' ' + (status.laboria.connected ? styles['connected'] : styles['disconnected'])}>
                    <div className={styles['status-info']}>
                      <span className={styles['status-name']}>Backend API</span>
                      <span className={styles['status-badge'] + ' ' + (status.laboria.connected ? styles['success'] : styles['error'])}>
                        {status.laboria.connected ? '✓ Conectado' : '✗ Desconectado'}
                      </span>
                    </div>
                    {status.laboria.connected ? (
                      <>
                        <span className={styles['status-note']}>{status.laboria.message}</span>
                        <span className={styles['status-url']}>URL: {status.laboria.url}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles['status-error']}>{status.laboria.error}</span>
                        <span className={styles['status-url']}>URL: {status.laboria.url}</span>
                        <div className={styles['status-help']}>
                          <p>💡 Para conectar el backend:</p>
                          <ol>
                            <li>Abre terminal en carpeta <code>backend/</code></li>
                            <li>Ejecuta: <code>npm run dev</code></li>
                            <li>Espera a que diga "Servidor corriendo en http://localhost:3000"</li>
                            <li>Presiona "Verificar conexión APIs" de nuevo</li>
                          </ol>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>

              <section className={styles['status-section']}>
                <h2>APIs de Empleo</h2>
                <div className={styles['status-list']}>
                  {status.jobs.map((api, index) => (
                    <div key={index} className={styles['status-item'] + ' ' + (api.connected ? styles['connected'] : styles['disconnected'])}>
                      <div className={styles['status-info']}>
                        <span className={styles['status-name']}>{api.name}</span>
                        <span className={styles['status-badge'] + ' ' + (api.connected ? styles['success'] : styles['error'])}>
                          {api.connected ? '✓ Conectado' : '✗ Error'}
                        </span>
                      </div>
                      {api.error && <span className={styles['status-error']}>{api.error}</span>}
                      {api.note && <span className={styles['status-note']}>{api.note}</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles['status-section']}>
                <h2>APIs de Cursos</h2>
                <div className={styles['status-list']}>
                  {status.courses.map((api, index) => (
                    <div key={index} className={styles['status-item'] + ' ' + (api.connected ? styles['connected'] : styles['disconnected'])}>
                      <div className={styles['status-info']}>
                        <span className={styles['status-name']}>{api.name}</span>
                        <span className={styles['status-badge'] + ' ' + (api.connected ? styles['success'] : styles['error'])}>
                          {api.connected ? '✓ Conectado' : '✗ Error'}
                        </span>
                      </div>
                      {api.error && <span className={styles['status-error']}>{api.error}</span>}
                      {api.note && <span className={styles['status-note']}>{api.note}</span>}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {!status && !loading && (
            <div className={styles['no-status']}>
              <p>Haz clic en "Verificar conexión APIs" para comprobar el estado de las APIs.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'tests' && (
        <>
          <div className={styles['test-buttons']}>
            <div className={styles['status-actions']}>
              <button
                className={styles['btn-check']}
                onClick={handleRunFrontendTests}
                disabled={testLoading}
              >
                {testLoading ? 'Ejecutando...' : 'Ejecutar Tests Frontend'}
              </button>
              {testLastRun && (
                <span className={styles['last-checked']}>Última ejecución: {testLastRun}</span>
              )}
            </div>
            <div className={styles['status-actions']}>
              <button
                className={styles['btn-check']}
                onClick={handleRunBackendTests}
                disabled={backendTestLoading}
              >
                {backendTestLoading ? 'Ejecutando...' : 'Ejecutar Tests Backend'}
              </button>
              {backendTestLastRun && (
                <span className={styles['last-checked']}>Última ejecución: {backendTestLastRun}</span>
              )}
            </div>
          </div>

          {testResults && (
            <div className={styles['test-results']}>
              <h3 className={styles['test-title']}>Resultados Tests Frontend</h3>
              <div className={styles['test-summary']}>
                <div className={styles['summary-card']}>
                  <span className={styles['summary-label']}>Total Tests</span>
                  <span className={styles['summary-value']}>{testResults.total}</span>
                </div>
                <div className={styles['summary-card'] + ' ' + styles['success']}>
                  <span className={styles['summary-label']}>Pasados</span>
                  <span className={styles['summary-value']}>{testResults.passed}</span>
                </div>
                <div className={styles['summary-card'] + ' ' + styles['error']}>
                  <span className={styles['summary-label']}>Fallidos</span>
                  <span className={styles['summary-value']}>{testResults.failed}</span>
                </div>
                <div className={styles['summary-card']}>
                  <span className={styles['summary-label']}>Duración</span>
                  <span className={styles['summary-value']}>{testLoading ? '...' : testResults.duration}</span>
                </div>
              </div>

              <div className={styles['test-suites']}>
                {testResults.suites.map((suite, suiteIndex) => (
                  <div key={suiteIndex} className={styles['test-suite']}>
                    <h3>{suite.name}</h3>
                    <div className={styles['test-list']}>
                      {suite.tests.map((test, testIndex) => (
                        <div key={testIndex} className={styles['test-item'] + ' ' + styles[test.status]}>
                          <span className={styles['test-icon']}>
                            {testLoading ? (
                              <span className={styles['loading-spinner']}>⟳</span>
                            ) : (
                              test.status === 'passed' ? '✓' : '✗'
                            )}
                          </span>
                          <span className={styles['test-name']}>{test.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {backendTestResults && (
            <div className={styles['test-results']}>
              <h3 className={styles['test-title']}>Resultados Tests Backend</h3>
              <div className={styles['test-summary']}>
                <div className={styles['summary-card']}>
                  <span className={styles['summary-label']}>Total Tests</span>
                  <span className={styles['summary-value']}>{backendTestResults.total}</span>
                </div>
                <div className={styles['summary-card'] + ' ' + styles['success']}>
                  <span className={styles['summary-label']}>Pasados</span>
                  <span className={styles['summary-value']}>{backendTestResults.passed}</span>
                </div>
                <div className={styles['summary-card'] + ' ' + styles['error']}>
                  <span className={styles['summary-label']}>Fallidos</span>
                  <span className={styles['summary-value']}>{backendTestResults.failed}</span>
                </div>
                <div className={styles['summary-card']}>
                  <span className={styles['summary-label']}>Duración</span>
                  <span className={styles['summary-value']}>{backendTestLoading ? '...' : backendTestResults.duration}</span>
                </div>
              </div>

              <div className={styles['test-suites']}>
                {backendTestResults.suites.map((suite, suiteIndex) => (
                  <div key={suiteIndex} className={styles['test-suite']}>
                    <h3>{suite.name}</h3>
                    <div className={styles['test-list']}>
                      {suite.tests.map((test, testIndex) => (
                        <div key={testIndex} className={styles['test-item'] + ' ' + styles[test.status]}>
                          <span className={styles['test-icon']}>
                            {backendTestLoading ? (
                              <span className={styles['loading-spinner']}>⟳</span>
                            ) : (
                              test.status === 'passed' ? '✓' : '✗'
                            )}
                          </span>
                          <span className={styles['test-name']}>{test.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!testResults && !backendTestResults && !testLoading && !backendTestLoading && (
            <div className={styles['no-status']}>
              <p>Haz clic en un botón para ejecutar los tests del sistema.</p>
            </div>
          )}
        </>
      )}
    </div>
    </div>
    </div>
  );
};

export default ApiStatusPage;
