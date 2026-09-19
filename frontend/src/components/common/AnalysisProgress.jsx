import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, FileText, Cpu, Database, Network } from 'lucide-react';

const STAGES = [
  { id: 'upload', label: 'Documents received & validated', icon: FileText },
  { id: 'extract', label: 'Extracting text & page structures', icon: FileText },
  { id: 'gemini_prompt', label: 'Requirements identification', icon: Cpu },
  { id: 'comparing_requirements', label: 'Comparing requirements & detecting contradictions', icon: Sparkles },
  { id: 'detecting_ambiguities', label: 'Analyzing ambiguous statements', icon: Sparkles },
  { id: 'finding_missing_information', label: 'Identifying missing constraints & rules', icon: Sparkles },
  { id: 'building_dependency_map', label: 'Building dependency graph', icon: Network },
  { id: 'persistence', label: 'Saving report to database', icon: Database }
];

export default function AnalysisProgress({ currentStage = 'upload', percent = 20, message = 'Processing...' }) {
  // Determine index of current stage
  const currentIdx = STAGES.findIndex(s => s.id === currentStage);
  const activeIdx = currentIdx !== -1 ? currentIdx : Math.min(Math.floor((percent / 100) * STAGES.length), STAGES.length - 1);

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--accent-gradient)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px var(--accent-glow)',
          marginBottom: '1rem'
        }}>
          <Sparkles size={28} color="#ffffff" className="animate-spin-slow" />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Requirements Intelligence Pipeline</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--bg-surface-elevated)',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: `${Math.max(percent, 8)}%`,
          height: '100%',
          background: 'var(--accent-gradient)',
          borderRadius: '9999px',
          transition: 'width 400ms ease-out'
        }} />
      </div>

      {/* Stage Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                fontSize: '0.9rem',
                color: isDone ? 'var(--text-primary)' : isCurrent ? 'var(--accent-light)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 600 : 400,
                transition: 'color 200ms ease'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} color="#10b981" />
              ) : isCurrent ? (
                <Loader2 size={18} color="var(--accent-light)" style={{ animation: 'spinSlow 1.5s linear infinite' }} />
              ) : (
                <Circle size={18} color="rgba(255, 255, 255, 0.2)" />
              )}
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
