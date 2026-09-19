import React from 'react';
import { ArrowRight, GitFork, BookOpen, Layers } from 'lucide-react';

export default function DependencyList({ dependencies = [], requirements = [] }) {
  if (!dependencies || dependencies.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No explicit requirement dependencies detected.</p>
      </div>
    );
  }

  const reqMap = new Map(requirements.map(r => [r.id, r]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {dependencies.map((dep, idx) => {
        const sourceReq = reqMap.get(dep.sourceRequirementId);
        const targetReq = reqMap.get(dep.targetRequirementId);

        return (
          <div
            key={dep.id || idx}
            className="glass-panel"
            style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-surface-elevated)' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-dependency">
                  <GitFork size={12} />
                  <span>{dep.dependencyType || 'Prerequisite'}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {dep.id}</span>
              </div>

              {/* Requirement ID arrow flow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {dep.sourceRequirementId}
                </span>
                <ArrowRight size={14} color="var(--accent-light)" />
                <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {dep.targetRequirementId}
                </span>
              </div>
            </div>

            {/* Side-by-side text preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                borderLeft: '2px solid #10b981'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', marginBottom: '0.35rem' }}>
                  SOURCE (Pre-condition)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {sourceReq?.text || `Requirement ${dep.sourceRequirementId}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {sourceReq?.sourceDocument}
                </div>
              </div>

              <div style={{
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                borderLeft: '2px solid var(--accent-light)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-light)', marginBottom: '0.35rem' }}>
                  TARGET (Dependent)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {targetReq?.text || `Requirement ${dep.targetRequirementId}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {targetReq?.sourceDocument}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Dependency Logic: </strong>
              {dep.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
}
