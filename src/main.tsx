import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in DAILY/FIT:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (const reg of regs) reg.unregister();
        });
      }
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFF0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Barlow', -apple-system, sans-serif" }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D5', borderRadius: '24px', padding: '28px 24px', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 16px 36px rgba(22,35,43,0.08)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: '#16232B', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(22,35,43,0.15)' }}>
              <img src="/logo-white.png" alt="DAILY/FIT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16232B', margin: '0 0 8px 0', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>DAILY/FIT RECOVERY</h2>
            <p style={{ fontSize: '13px', color: '#526673', margin: '0 0 16px 0', lineHeight: '1.5' }}>
              Something prevented the page from rendering properly. Tap below to reset your cache and reload.
            </p>
            {this.state.error && (
              <pre style={{ fontSize: '10px', color: '#D32F2F', backgroundColor: '#FFF0E8', padding: '10px', borderRadius: '12px', overflowX: 'auto', textAlign: 'left', marginBottom: '16px', border: '1px solid #FF5B04/20' }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{ width: '100%', padding: '12px', backgroundColor: '#FF5B04', color: '#FFFFFF', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', letterSpacing: '0.5px' }}
            >
              Reset Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
