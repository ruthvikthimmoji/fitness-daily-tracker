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
        <div style={{ minHeight: '100vh', backgroundColor: '#EAF2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #BFBFBF', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFEB9C', color: '#7F6000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '24px', fontWeight: 'bold' }}>!</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F4E5F', margin: '0 0 8px 0' }}>DAILY/FIT Recovery</h2>
            <p style={{ fontSize: '13px', color: '#595959', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              Something prevented the page from rendering properly. Tap below to reset your cache and reload.
            </p>
            {this.state.error && (
              <pre style={{ fontSize: '10px', color: '#C00000', backgroundColor: '#F8CBAD', padding: '8px', borderRadius: '6px', overflowX: 'auto', textAlign: 'left', marginBottom: '16px' }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{ width: '100%', padding: '10px', backgroundColor: '#1F4E5F', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
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
