import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Key, FileCheck, Sparkles, AlertCircle, FileText } from 'lucide-react';
import Dropzone from '../components/upload/Dropzone';
import FileList from '../components/upload/FileList';
import AnalysisProgress from '../components/common/AnalysisProgress';
import ErrorState from '../components/common/ErrorState';
import { parseUserFacingError } from '../utils/errorParser';
import { api } from '../services/api';

const SAMPLE_DOC_1 = `USER PRIVACY & ACCOUNT MANAGEMENT POLICY
Document: user-policy-v2.pdf | Page 1
SECTION 1: REGISTRATION & ONBOARDING
REQ-001: Prospective users must provide a verified corporate or personal email address.
REQ-002: A 6-digit confirmation code must be emailed within 60 seconds of registration.
REQ-003: User account activation occurs immediately upon confirmation code verification.
REQ-004: Activated users must be granted immediate access to the dashboard portal.

SECTION 2: ACCOUNT DELETION & RIGHT TO BE FORGOTTEN
REQ-005: Registered users have the unconditional right to permanently delete their account at any time via settings.
REQ-006: Upon confirmed deletion, the system must immediately and permanently purge all user records, transaction histories, and stored personal data within 60 seconds without delay.
REQ-007: Following deletion, zero identifiable telemetry or logs shall be retained on any active or backup storage systems.

SECTION 3: SYSTEM PERFORMANCE & AVAILABILITY
REQ-008: The search interface and analytics dashboard should respond quickly under normal system workloads.
REQ-009: The application should be highly secure against unauthorized intrusions and provide intuitive access controls.
REQ-010: Users should receive email notifications regarding system updates regularly.`;

const SAMPLE_DOC_2 = `STATUTORY FINANCIAL COMPLIANCE & AUDIT SPEC
Document: financial-compliance.pdf | Page 1
SECTION 1: STATUTORY AUDIT & DATA RETENTION
REQ-101: The system must log every state-changing API request and monetary transfer in an append-only audit ledger.
REQ-102: All ledger entries must record user identity, IP address, timestamp, and cryptographic signatures.
REQ-103: In accordance with statutory banking regulations and financial anti-fraud requirements, all financial transactions, customer transaction histories, payment invoices, and monetary audit logs must be permanently retained for a minimum mandatory period of seven years.
REQ-104: Under no circumstances may transaction history records, customer ledger references, or financial audit trails be deleted, purged, or truncated prior to the expiration of the statutory seven-year retention window.

SECTION 2: AUTHENTICATION & ACCESS CONTROL
REQ-105: Transfers exceeding $1,000 require two-factor authentication.
REQ-106: Session tokens must be securely stored and authenticated for all sensitive transactions.
REQ-107: Security audit logs must be reviewed by the compliance officer on an ongoing periodic basis.
REQ-108: Users must be immediately notified of any password reset or high-value monetary transaction via SMS within 15 seconds.`;

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyField, setShowApiKeyField] = useState(false);

  // Analysis / streaming state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStage, setProgressStage] = useState('upload');
  const [progressPercent, setProgressPercent] = useState(15);
  const [progressMessage, setProgressMessage] = useState('Initializing analysis...');
  const [error, setError] = useState(null);

  const handleFilesSelected = (newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoadSampleDocs = () => {
    const file1 = new File([SAMPLE_DOC_1], '01_user_privacy_policy.txt', { type: 'text/plain' });
    const file2 = new File([SAMPLE_DOC_2], '02_financial_compliance.txt', { type: 'text/plain' });
    setFiles([file1, file2]);
    setTitle('Policy & Compliance Comparison');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 2) return;

    setError(null);
    setIsAnalyzing(true);
    setProgressStage('upload');
    setProgressPercent(15);
    setProgressMessage('Streaming documents to intelligence server...');

    const formData = new FormData();
    files.forEach(f => formData.append('documents', f));

    if (title.trim()) formData.append('title', title.trim());
    if (apiKey.trim()) formData.append('apiKey', apiKey.trim());

    try {
      await api.streamAnalyzeDocuments(formData, {
        onProgress: (data) => {
          if (data.stage) setProgressStage(data.stage);
          if (data.percent) setProgressPercent(data.percent);
          if (data.message) setProgressMessage(data.message);
        },
        onComplete: (data) => {
          setProgressPercent(100);
          setProgressMessage('Analysis completed!');
          setTimeout(() => {
            const analysisId = data.analysisId || data.data?._id;
            if (analysisId) {
              navigate(`/dashboard/${analysisId}`);
            } else {
              navigate('/history');
            }
          }, 800);
        },
        onError: (errData) => {
          setIsAnalyzing(false);
          setError(errData);
          const parsed = parseUserFacingError(errData);
          if (parsed?.category === 'invalid_key') {
            setShowApiKeyField(true);
          }
        }
      });
    } catch (err) {
      setIsAnalyzing(false);
      setError(err);
      const parsed = parseUserFacingError(err);
      if (parsed?.category === 'invalid_key') {
        setShowApiKeyField(true);
      }
    }
  };

  if (isAnalyzing) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <AnalysisProgress
          currentStage={progressStage}
          percent={progressPercent}
          message={progressMessage}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Upload Requirements</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Select at least two specification documents to compare and detect contradictions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleDocs}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Sparkles size={14} color="var(--accent-light)" />
            <span>Load Conflicting Demo Docs</span>
          </button>
        </div>
      </div>

      {error && (
        <ErrorState
          error={error}
          onRetry={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Dropzone */}
        <Dropzone onFilesSelected={handleFilesSelected} />

        {/* Selected Files List */}
        <FileList files={files} onRemoveFile={handleRemoveFile} />

        {/* Settings Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem'
            }}>
              Analysis Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Account Lifecycle vs GDPR Compliance Spec"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Optional Gemini API Key override */}
          <div>
            <div
              onClick={() => setShowApiKeyField(!showApiKeyField)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--accent-light)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <Key size={14} />
              <span>{showApiKeyField ? 'Hide custom Gemini API Key' : 'Provide custom Gemini API Key (Optional)'}</span>
            </div>

            {showApiKeyField && (
              <div style={{ marginTop: '0.75rem' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  If omitted, backend environment key or built-in reasoning engine will be used.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {files.length < 2 ? (
              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertCircle size={14} />
                Requires at least 2 documents to initiate comparative reasoning
              </span>
            ) : (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileCheck size={14} />
                Ready: {files.length} documents staged for analysis
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={files.length < 2 || isAnalyzing}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            <Zap size={18} />
            <span>Start Requirements Analysis</span>
          </button>
        </div>
      </form>
    </div>
  );
}
