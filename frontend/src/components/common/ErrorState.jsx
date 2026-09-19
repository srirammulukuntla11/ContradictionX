import React from 'react';
import { AlertTriangle, RotateCcw, KeyRound, Clock, ServerCrash, WifiOff, AlertCircle, Cpu } from 'lucide-react';
import { parseUserFacingError } from '../../utils/errorParser';

export default function ErrorState({ title, message, technicalDetail, error, onRetry }) {
  // If an error object or raw error string is supplied, parse it through user-facing rules
  const parsed = error ? parseUserFacingError(error) : (message ? parseUserFacingError(message) : null);

  const displayTitle = title || parsed?.title || 'Analysis Error';
  const displayMessage = (typeof message === 'string' && title) ? message : (parsed?.message || message || 'An unexpected error occurred during processing.');
  const displayDetail = technicalDetail || parsed?.technicalDetail || null;
  const category = parsed?.category || 'general_error';

  const renderIcon = () => {
    switch (category) {
      case 'invalid_key':
        return <KeyRound size={24} color="#f59e0b" />;
      case 'rate_limit':
        return <Clock size={24} color="#f59e0b" />;
      case 'unavailable':
        return <ServerCrash size={24} color="#f59e0b" />;
      case 'model_unavailable':
      case 'invalid_model':
        return <Cpu size={24} color="#f59e0b" />;
      case 'connection':
        return <WifiOff size={24} color="#ef4444" />;
      default:
        return <AlertTriangle size={24} color="#ef4444" />;
    }
  };

  const getIconBg = () => {
    switch (category) {
      case 'invalid_key':
      case 'rate_limit':
      case 'unavailable':
      case 'model_unavailable':
      case 'invalid_model':
        return 'rgba(245, 158, 11, 0.15)';
      default:
        return 'rgba(239, 68, 68, 0.15)';
    }
  };

  const getBorderColor = () => {
    switch (category) {
      case 'invalid_key':
      case 'rate_limit':
      case 'unavailable':
      case 'model_unavailable':
      case 'invalid_model':
        return '1px solid rgba(245, 158, 11, 0.3)';
      default:
        return '1px solid rgba(239, 68, 68, 0.3)';
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '2rem 2.5rem',
      maxWidth: '600px',
      margin: '1.5rem auto',
      textAlign: 'center',
      border: getBorderColor(),
      background: 'rgba(15, 23, 42, 0.75)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: getIconBg(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {renderIcon()}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', color: '#f8fafc' }}>
        {displayTitle}
      </h3>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        marginBottom: displayDetail ? '1rem' : '1.5rem',
        lineHeight: 1.6
      }}>
        {displayMessage}
      </p>

      {displayDetail && (
        <div style={{
          display: 'inline-block',
          padding: '0.3rem 0.85rem',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem'
        }}>
          {displayDetail}
        </div>
      )}

      {onRetry && (
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={onRetry}
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}

