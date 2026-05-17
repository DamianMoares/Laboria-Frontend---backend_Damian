import React, { createContext, useState, useCallback, useContext } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: '', resolve: null });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ open: true, message, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve(true);
    setState({ open: false, message: '', resolve: null });
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve(false);
    setState({ open: false, message: '', resolve: null });
  }, [state]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
          <div style={{
            backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px',
            maxWidth: '400px', width: '90%', border: '1px solid #3a3a3a',
          }}>
            <p style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              {state.message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.5rem 1.5rem', borderRadius: '8px', border: '2px solid #d4af37',
                  background: 'transparent', color: '#d4af37', cursor: 'pointer', fontWeight: 600,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none',
                  background: '#d4af37', color: '#0a0a0a', cursor: 'pointer', fontWeight: 600,
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
