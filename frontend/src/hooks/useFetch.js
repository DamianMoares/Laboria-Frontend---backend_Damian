import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para peticiones HTTP con AbortController y manejo de errores.
 * @param {string} url - URL de la API
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.enabled - Auto-fetch al montar (default: true)
 * @param {string} options.method - Método HTTP (default: 'GET')
 * @param {Object} options.headers - Headers adicionales
 * @param {*} options.body - Body para peticiones POST/PUT/PATCH
 * @param {boolean} options.cache - Usar caché (default: true)
 * @returns {Object} Estado y funciones de fetch
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const { enabled = true, method = 'GET', headers = {}, body = null, cache = true } = options;

  /**
   * Ejecuta una petición fetch con configuración personalizable.
   * @param {Object} overrideOptions - Opciones que sobrescriben las defaults
   * @returns {Promise<Object>} { success, data, error, aborted }
   */
  const fetchData = useCallback(async (overrideOptions = {}) => {
    const finalUrl = overrideOptions.url || url;
    const finalMethod = overrideOptions.method || method;
    const finalHeaders = { 'Content-Type': 'application/json', ...headers, ...overrideOptions.headers };
    const finalBody = overrideOptions.body || body;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const fetchOptions = {
        method: finalMethod,
        headers: finalHeaders,
        signal: controller.signal
      };

      if (finalBody && finalMethod !== 'GET') {
        fetchOptions.body = JSON.stringify(finalBody);
      }

      const response = await fetch(finalUrl, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, aborted: true };
      setError(err.message || 'Error de conexión');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body]);

  /**
   * Ejecuta petición POST.
   * @param {Object} postData - Datos a enviar
   * @returns {Promise<Object>} Resultado de la petición
   */
  const postData = useCallback(async (postData) => {
    return fetchData({ method: 'POST', body: postData });
  }, [fetchData]);

  /**
   * Ejecuta petición PUT.
   * @param {Object} putData - Datos a enviar
   * @returns {Promise<Object>} Resultado de la petición
   */
  const putData = useCallback(async (putData) => {
    return fetchData({ method: 'PUT', body: putData });
  }, [fetchData]);

  /**
   * Ejecuta petición PATCH.
   * @param {Object} patchData - Datos a enviar
   * @returns {Promise<Object>} Resultado de la petición
   */
  const patchData = useCallback(async (patchData) => {
    return fetchData({ method: 'PATCH', body: patchData });
  }, [fetchData]);

  /**
   * Ejecuta petición DELETE.
   * @returns {Promise<Object>} Resultado de la petición
   */
  const deleteData = useCallback(async () => {
    return fetchData({ method: 'DELETE' });
  }, [fetchData]);

  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, url]);

  /**
   * Restablece el estado a valores iniciales.
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    postData,
    putData,
    patchData,
    deleteData,
    reset
  };
};

export default useFetch;
