import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '2rem 0',
      marginTop: 'auto',
      background: 'rgba(8, 11, 19, 0.95)',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--accent-light)" />
          <span><strong>ContradictionX</strong> — AI Requirements Intelligence Platform</span>
        </div>

        <div>
          <span>AI findings are potential issues and require human review.</span>
        </div>
      </div>
    </footer>
  );
}

