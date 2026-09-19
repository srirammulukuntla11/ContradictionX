import React from 'react';
import { FileText, Trash2, CheckCircle2 } from 'lucide-react';

export default function FileList({ files, onRemoveFile }) {
  if (!files || files.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
      }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Selected Documents ({files.length})
        </h4>
        <span style={{ fontSize: '0.8rem', color: files.length >= 2 ? '#10b981' : '#f59e0b' }}>
          {files.length >= 2 ? '✓ Ready for comparative analysis' : '⚠ Add at least 1 more document'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {files.map((file, index) => {
          const isPdf = file.name.toLowerCase().endsWith('.pdf');

          return (
            <div
              key={`${file.name}-${index}`}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: isPdf ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: isPdf ? '#ef4444' : '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={18} />
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '450px'
                  }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatFileSize(file.size)} • Document {index + 1}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="btn-danger-ghost"
                title="Remove file"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
