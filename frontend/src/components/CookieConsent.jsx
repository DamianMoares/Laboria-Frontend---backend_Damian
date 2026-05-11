import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  // Cargar consentimiento guardado
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const { timestamp, preferences: savedPrefs } = JSON.parse(savedConsent);
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      
      // Verificar si ha pasado 1 año
      if (Date.now() - timestamp > oneYear) {
        localStorage.removeItem('cookieConsent');
        setShowBanner(true);
      } else {
        setPreferences(savedPrefs);
        applyConsent(savedPrefs);
      }
    }
  }, []);

  const applyConsent = (prefs) => {
    // Aquí se pueden cargar scripts según las preferencias
    
    // Ejemplo: cargar Google Analytics si analytics es true
    if (prefs.analytics) {
      // window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    } else {
      // window.gtag('consent', 'update', { 'analytics_storage': 'denied' });
    }
    
    // Ejemplo: cargar scripts de marketing si marketing es true
    if (prefs.marketing) {
      // Cargar scripts de marketing
    }
  };

  const saveConsent = (prefs) => {
    const consentData = {
      timestamp: Date.now(),
      preferences: prefs
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setPreferences(prefs);
    applyConsent(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = {
      essential: true,
      analytics: false,
      marketing: false
    };
    saveConsent(allRejected);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleToggle = (category) => {
    if (category === 'essential') return; // Las esenciales no se pueden desactivar
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div className="cookie-consent-banner">
        {!showPreferences ? (
          <>
            <div className="cookie-content">
              <h2 id="cookie-title" className="cookie-title">🍪 Política de Cookies</h2>
              <p id="cookie-description" className="cookie-description">
                Utilizamos cookies para mejorar su experiencia en nuestro portal. 
                Puede aceptar todas las cookies, rechazar las no esenciales, o configurar sus preferencias.
              </p>
              <a href="/legal/politica-privacidad.html" className="cookie-link" target="_blank" rel="noopener noreferrer">
                Más información sobre cookies
              </a>
            </div>
            <div className="cookie-actions">
              <button
                className="cookie-button cookie-button-secondary"
                onClick={handleRejectAll}
                onKeyDown={(e) => handleKeyDown(e, handleRejectAll)}
                aria-label="Rechazar todas las cookies no esenciales"
              >
                Rechazar
              </button>
              <button
                className="cookie-button cookie-button-secondary"
                onClick={() => setShowPreferences(true)}
                onKeyDown={(e) => handleKeyDown(e, () => setShowPreferences(true))}
                aria-label="Configurar preferencias de cookies"
              >
                Preferencias
              </button>
              <button
                className="cookie-button cookie-button-primary"
                onClick={handleAcceptAll}
                onKeyDown={(e) => handleKeyDown(e, handleAcceptAll)}
                aria-label="Aceptar todas las cookies"
              >
                Aceptar Todo
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-preferences">
            <h2 id="cookie-title" className="cookie-title">Configurar Cookies</h2>
            <p className="cookie-description">
              Seleccione las categorías de cookies que desea aceptar:
            </p>
            
            <div className="cookie-category">
              <div className="cookie-category-header">
                <input
                  type="checkbox"
                  id="essential"
                  checked={preferences.essential}
                  disabled
                  aria-label="Cookies esenciales (siempre activas)"
                />
                <label htmlFor="essential" className="cookie-category-label">
                  <strong>Cookies Esenciales</strong>
                  <span className="cookie-category-description">
                    Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
                  </span>
                </label>
              </div>
            </div>

            <div className="cookie-category">
              <div className="cookie-category-header">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={preferences.analytics}
                  onChange={() => handleToggle('analytics')}
                  aria-label="Cookies de análisis"
                />
                <label htmlFor="analytics" className="cookie-category-label">
                  <strong>Cookies de Análisis</strong>
                  <span className="cookie-category-description">
                    Nos ayudan a entender cómo usa el sitio para mejorarlo.
                  </span>
                </label>
              </div>
            </div>

            <div className="cookie-category">
              <div className="cookie-category-header">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                  aria-label="Cookies de marketing"
                />
                <label htmlFor="marketing" className="cookie-category-label">
                  <strong>Cookies de Marketing</strong>
                  <span className="cookie-category-description">
                    Se utilizan para mostrar anuncios personalizados.
                  </span>
                </label>
              </div>
            </div>

            <div className="cookie-actions">
              <button
                className="cookie-button cookie-button-secondary"
                onClick={() => setShowPreferences(false)}
                onKeyDown={(e) => handleKeyDown(e, () => setShowPreferences(false))}
                aria-label="Volver al banner principal"
              >
                Volver
              </button>
              <button
                className="cookie-button cookie-button-primary"
                onClick={handleSavePreferences}
                onKeyDown={(e) => handleKeyDown(e, handleSavePreferences)}
                aria-label="Guardar preferencias de cookies"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
