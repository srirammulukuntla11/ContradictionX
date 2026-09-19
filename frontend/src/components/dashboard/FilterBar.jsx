import React from 'react';
import { AlertTriangle, HelpCircle, FileQuestion, GitFork, ListFilter } from 'lucide-react';

export default function FilterBar({ activeFilter, onFilterChange, counts = {} }) {
  const filters = [
    { id: 'all', label: 'All Issues', count: (counts.contradictions || 0) + (counts.ambiguities || 0) + (counts.missing || 0) + (counts.dependencies || 0) },
    { id: 'contradictions', label: 'Contradictions', count: counts.contradictions || 0, icon: AlertTriangle, color: 'var(--cat-contradiction)' },
    { id: 'ambiguities', label: 'Ambiguities', count: counts.ambiguities || 0, icon: HelpCircle, color: 'var(--cat-ambiguity)' },
    { id: 'missing', label: 'Missing Info', count: counts.missing || 0, icon: FileQuestion, color: 'var(--cat-missing)' },
    { id: 'dependencies', label: 'Dependencies', count: counts.dependencies || 0, icon: GitFork, color: 'var(--cat-dependency)' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem'
    }}>
      {filters.map(filter => {
        const isActive = activeFilter === filter.id;
        const Icon = filter.icon;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
              background: isActive ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${isActive ? 'var(--accent-light)' : 'var(--border-subtle)'}`,
              boxShadow: isActive ? '0 4px 12px var(--accent-glow)' : 'none'
            }}
          >
            {Icon && <Icon size={14} color={isActive ? '#ffffff' : filter.color} />}
            <span>{filter.label}</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
              color: isActive ? '#ffffff' : 'var(--text-muted)'
            }}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
