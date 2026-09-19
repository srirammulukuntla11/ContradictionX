import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, AlertCircle } from 'lucide-react';

export default function Dropzone({ onFilesSelected, maxFiles = 10 }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndAddFiles = (fileList) => {
    setError(null);
    const validFiles = [];
    const allowedExtensions = ['.pdf', '.txt'];

    for (const file of fileList) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setError(`"${file.name}" is not a supported file. Only PDF and TXT documents are supported.`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 15MB file size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // reset input value so re-selecting same file triggers change
    e.target.value = null;
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
          background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: isDragOver ? 'var(--accent-light)' : 'var(--text-secondary)'
        }}>
          <UploadCloud size={28} />
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Drop requirement documents here or <span style={{ color: 'var(--accent-light)' }}>browse files</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Supports <strong>PDF</strong> and <strong>TXT</strong> files up to 15MB each
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileType size={14} /> PDF Documents
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileType size={14} /> TXT Requirements
          </span>
          <span>•</span>
          <span>Minimum 2 documents to compare</span>
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#ef4444',
          fontSize: '0.85rem',
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
