import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
          color: '#fff',
          backgroundColor: '#0a0a0a',
        }}>
          <h1 style={{ color: '#d4af37', fontSize: '2rem', marginBottom: '1rem' }}>
            Algo salió mal
          </h1>
          <p style={{ color: '#ccc', marginBottom: '2rem', maxWidth: '500px' }}>
            {this.state.error?.message || 'Ha ocurrido un error inesperado. Intenta recargar la página.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#d4af37',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
