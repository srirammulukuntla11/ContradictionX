import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, ArrowLeft, RefreshCw, Network, Layers, AlertTriangle, Cpu } from 'lucide-react';
import StatsOverview from '../components/dashboard/StatsOverview';
import FilterBar from '../components/dashboard/FilterBar';
import IssueCard from '../components/dashboard/IssueCard';
import IssueDetailModal from '../components/issues/IssueDetailModal';
import DependencyGraph from '../components/graph/DependencyGraph';
import LoadingState from '../components/common/AnalysisProgress';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { api } from '../services/api';

export default function DashboardPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filter: 'all' | 'contradictions' | 'ambiguities' | 'missing' | 'dependencies'
  const [activeFilter, setActiveFilter] = useState('all');

  // Currently inspected issue in modal
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Active view mode: 'issues' | 'graph'
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.getAnalysis(id)
      .then(res => {
        setAnalysis(res.data);
      })
      .catch(err => {
        setError(err.message || 'Failed to load analysis report.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingState percent={75} message="Loading analysis intelligence report..." />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorState
          title="Analysis Report Not Found"
          message={error || 'Could not locate the requested intelligence report.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    title,
    model,
    createdAt,
    documents = [],
    requirements = [],
    contradictions = [],
    ambiguities = [],
    missingInformation = [],
    dependencies = [],
    summary = {}
  } = analysis;

  const counts = {
    contradictions: contradictions.length,
    ambiguities: ambiguities.length,
    missing: missingInformation.length,
    dependencies: dependencies.length
  };

  // Compile issues according to filter
  const getFilteredItems = () => {
    if (activeFilter === 'contradictions') {
      return contradictions.map(item => ({ item, category: 'contradictions' }));
    }
    if (activeFilter === 'ambiguities') {
      return ambiguities.map(item => ({ item, category: 'ambiguities' }));
    }
    if (activeFilter === 'missing') {
      return missingInformation.map(item => ({ item, category: 'missing' }));
    }
    if (activeFilter === 'dependencies') {
      return dependencies.map(item => ({ item, category: 'dependencies' }));
    }

    // 'all' combines them with contradictions first
    return [
      ...contradictions.map(item => ({ item, category: 'contradictions' })),
      ...ambiguities.map(item => ({ item, category: 'ambiguities' })),
      ...missingInformation.map(item => ({ item, category: 'missing' })),
      ...dependencies.map(item => ({ item, category: 'dependencies' }))
    ];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Top breadcrumb & metadata */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <Link to="/upload" className="btn-ghost" style={{ padding: '0.4rem 0.6rem' }}>
          <ArrowLeft size={16} />
          <span>New Analysis</span>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} />
            {documents.length} Documents Analyzed
          </span>
          {model && (
            <>
              <span>•</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: 'var(--accent-light)',
                fontWeight: 500,
                fontSize: '0.8rem'
              }}>
                <Cpu size={12} />
                {model}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Header Title & Document chips */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
          {title}
        </h1>

        {/* Documents compared chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {documents.map((doc, idx) => (
            <span
              key={doc.id || idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              <FileText size={13} color="var(--accent-light)" />
              <strong style={{ color: 'var(--text-primary)' }}>{doc.name}</strong>
              <span style={{ color: 'var(--text-muted)' }}>({doc.pageCount || 1}p)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats Cards Overview */}
      <StatsOverview summary={summary} documentsCount={documents.length} />

      {/* Navigation Tabs (Issues List vs Dependency Graph) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('issues')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.25rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: activeTab === 'issues' ? 'var(--accent-light)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'issues' ? '2px solid var(--accent-light)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={16} />
            <span>Identified Issues ({counts.contradictions + counts.ambiguities + counts.missing + counts.dependencies})</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.25rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: activeTab === 'graph' ? 'var(--accent-light)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'graph' ? '2px solid var(--accent-light)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            <Network size={16} />
            <span>Dependency Graph ({counts.dependencies})</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'issues' ? (
        <>
          {/* Category Filter Bar */}
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />

          {/* Issue Cards Grid */}
          {filteredItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredItems.map(({ item, category }) => (
                <IssueCard
                  key={item.id}
                  issue={item}
                  category={category}
                  onClick={() => setSelectedIssue(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Issues in this Category"
              description={`Zero items were detected for filter "${activeFilter}".`}
            />
          )}
        </>
      ) : (
        <DependencyGraph
          dependencies={dependencies}
          requirements={requirements}
        />
      )}

      {/* Investigation Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          requirements={requirements}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
