import React from 'react';
import { FolderSearch, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = FolderSearch,
  title = 'No Items Found',
  description = 'There are no items matching your criteria.',
  actionText,
  actionLink,
  onAction
}) {
  return (
    <div className="glass-panel" style={{
      padding: '3rem 2rem',
      textAlign: 'center',
      maxWidth: '480px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: actionText ? '1.5rem' : '0', lineHeight: 1.5 }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary">
          <PlusCircle size={16} />
          <span>{actionText}</span>
        </Link>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          <PlusCircle size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
