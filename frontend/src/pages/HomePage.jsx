import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Zap, AlertTriangle, HelpCircle, FileQuestion, GitFork, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { api } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleRunDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await api.loadDemoAnalysis();
      if (res.data?._id) {
        navigate(`/dashboard/${res.data._id}`);
      }
    } catch (err) {
      console.error('Demo load failed:', err);
      navigate('/upload');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const capabilities = [
    {
      title: 'Potential Contradictions',
      desc: 'Detects mutually exclusive business rules, retention vs. deletion collisions, and timing conflicts across documents.',
      icon: AlertTriangle,
      color: 'var(--cat-contradiction)',
      bg: 'var(--cat-contradiction-bg)'
    },
    {
      title: 'Ambiguities & Vagueness',
      desc: 'Flags non-testable, subjective terms like "respond quickly", "intuitive", or "highly secure" with measurable rewrites.',
      icon: HelpCircle,
      color: 'var(--cat-ambiguity)',
      bg: 'var(--cat-ambiguity-bg)'
    },
    {
      title: 'Missing Information',
      desc: 'Discovers absent boundary conditions, unspecified timeout periods, missing error handling, and permission gaps.',
      icon: FileQuestion,
      color: 'var(--cat-missing)',
      bg: 'var(--cat-missing-bg)'
    },
    {
      title: 'Dependency Graphing',
      desc: 'Constructs automated directed dependency DAGs between requirements to expose prerequisite execution chains.',
      icon: GitFork,
      color: 'var(--cat-dependency)',
      bg: 'var(--cat-dependency-bg)'
    }
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem'
        }}>
          Find requirement conflicts humans miss{' '}
          <span style={{
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            before they become software bugs.
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          maxWidth: '680px',
          margin: '0 auto 2.5rem'
        }}>
          ContradictionX analyzes multiple software specifications simultaneously to discover contradictions, ambiguities, missing logic, and dependencies.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/upload" className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <Zap size={18} />
            <span>Analyze Requirements</span>
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={handleRunDemo}
            disabled={isDemoLoading}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
          >
            <Play size={16} color="var(--accent-light)" />
            <span>{isDemoLoading ? 'Loading Sample...' : 'Try Demo Documents'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '4.5rem'
      }}>
        {capabilities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderTop: `3px solid ${item.color}`
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: item.bg,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Workflow Diagram Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>The Intelligence Pipeline</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          How ContradictionX turns unorganized specifications into actionable developer intelligence
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>STAGE 1</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>Multi-Doc Ingestion</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Uploads PDF and TXT specs with in-memory page and section indexing.
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>STAGE 2</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>Requirement Extraction</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Isolates discrete, numbered requirements (REQ-001) with source tracking.
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>STAGE 3</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>Comparative AI Reasoning</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Gemini model detects cross-document contradictions, ambiguities, and gaps.
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>STAGE 4</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>Evidence Dashboard</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Explore side-by-side evidence, confidence ratings, and suggested rewrites.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
