import React from 'react';
import { FileText, Bookmark, BookOpen } from 'lucide-react';

export default function RequirementEvidence({ req, label = 'Requirement', highlightColor = 'var(--accent-primary)' }) {
  if (!req) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', borderStyle: 'dashed' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Requirement reference not found.</p>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        borderTop: `3px solid ${highlightColor}`,
        background: 'var(--bg-surface-elevated)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: highlightColor,
            letterSpacing: '0.05em'
          }}>
            {label}
          </span>

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px'
          }}>
            {req.id}
          </span>
        </div>

        <blockquote style={{
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          fontStyle: 'normal',
          marginBottom: '1rem',
          borderLeft: `2px solid ${highlightColor}`,
          paddingLeft: '0.75rem'
        }}>
          "{req.text}"
        </blockquote>
      </div>

      {/* Source Citation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <FileText size={13} color="var(--accent-light)" />
          <strong>{req.sourceDocument}</strong>
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <BookOpen size={13} />
          Page {req.page || 1}
        </span>
        {req.section && (
          <>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Bookmark size={13} />
              {req.section}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
