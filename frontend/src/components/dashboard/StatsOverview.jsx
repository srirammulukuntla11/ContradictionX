import React from 'react';
import { FileText, Layers, AlertTriangle, HelpCircle, FileQuestion, GitFork } from 'lucide-react';

export default function StatsOverview({ summary = {}, documentsCount = 0 }) {
  const stats = [
    {
      label: 'Requirements Extracted',
      value: summary.totalRequirements || 0,
      icon: Layers,
      color: 'var(--accent-light)',
      bg: 'rgba(99, 102, 241, 0.1)'
    },
    {
      label: 'Potential Contradictions',
      value: summary.contradictionsCount || 0,
      icon: AlertTriangle,
      color: 'var(--cat-contradiction)',
      bg: 'var(--cat-contradiction-bg)',
      highlight: (summary.contradictionsCount || 0) > 0
    },
    {
      label: 'Ambiguous Requirements',
      value: summary.ambiguitiesCount || 0,
      icon: HelpCircle,
      color: 'var(--cat-ambiguity)',
      bg: 'var(--cat-ambiguity-bg)'
    },
    {
      label: 'Missing Information',
      value: summary.missingInfoCount || 0,
      icon: FileQuestion,
      color: 'var(--cat-missing)',
      bg: 'var(--cat-missing-bg)'
    },
    {
      label: 'Dependencies Found',
      value: summary.dependenciesCount || 0,
      icon: GitFork,
      color: 'var(--cat-dependency)',
      bg: 'var(--cat-dependency-bg)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: stat.highlight ? `3px solid ${stat.color}` : undefined
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 700,
                lineHeight: 1.1
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
