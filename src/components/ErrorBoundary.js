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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          minHeight: '100vh',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>
            Drill Baby Drill Empire Error
          </h2>
          <p style={{ color: '#ffffff', marginBottom: '20px' }}>
            Something went wrong with the app. Check the console for details.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reload App
          </button>
          <pre style={{
            color: '#ff6b6b',
            fontSize: '12px',
            marginTop: '20px',
            padding: '10px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '5px',
            maxWidth: '80%',
            overflow: 'auto'
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
