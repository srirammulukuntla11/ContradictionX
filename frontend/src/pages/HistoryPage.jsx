import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Calendar, FileText, Trash2, ArrowRight, AlertTriangle, Layers, Plus, Cpu } from 'lucide-react';
import LoadingState from '../components/common/AnalysisProgress';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { api } from '../services/api';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = () => {
    setLoading(true);
    setError(null);
    api.listAnalyses()
      .then(res => {
        setAnalyses(res.data || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch analysis history.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis report?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(`Could not delete analysis: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingState percent={60} message="Loading analysis history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorState
          title="History Unavailable"
          message={error}
          onRetry={fetchHistory}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '960px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HistoryIcon size={26} color="var(--accent-light)" />
            <span>Analysis History</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Browse and inspect previous requirements intelligence reports.
          </p>
        </div>

        <Link to="/upload" className="btn-primary">
          <Plus size={16} />
          <span>New Analysis</span>
        </Link>
      </div>

      {analyses.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {analyses.map(item => {
            const summary = item.summary || {};
            const docCount = item.documents?.length || 0;
            const isDeleting = deletingId === item._id;

            return (
              <div
                key={item._id}
                className="glass-panel"
                onClick={() => navigate(`/dashboard/${item._id}`)}
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ flex: '1 1 340px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.85rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FileText size={13} color="var(--accent-light)" />
                      {docCount} {docCount === 1 ? 'document' : 'documents'}
                    </span>
                    {item.model && (
                      <>
                        <span>•</span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: 'var(--accent-light)'
                        }}>
                          <Cpu size={12} />
                          {item.model}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Counts badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {(summary.contradictionsCount || 0) > 0 && (
                    <span className="badge badge-contradiction">
                      <AlertTriangle size={11} />
                      <span>{summary.contradictionsCount} Contradictions</span>
                    </span>
                  )}

                  {(summary.ambiguitiesCount || 0) > 0 && (
                    <span className="badge badge-ambiguity">
                      <span>{summary.ambiguitiesCount} Ambiguities</span>
                    </span>
                  )}

                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                    <span>{summary.totalRequirements || 0} Reqs</span>
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item._id, e)}
                    disabled={isDeleting}
                    className="btn-danger-ghost"
                    title="Delete report"
                  >
                    <Trash2 size={14} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>

                  <div style={{ color: 'var(--accent-light)', display: 'flex', alignItems: 'center' }}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Previous Analyses Saved"
          description="Uploaded requirement reports will be saved here in MongoDB for quick reference and comparison."
          actionText="Analyze Your First Documents"
          actionLink="/upload"
        />
      )}
    </div>
  );
}
