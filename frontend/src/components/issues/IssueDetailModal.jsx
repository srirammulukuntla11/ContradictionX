import React from 'react';
import { X, AlertTriangle, HelpCircle, FileQuestion, GitFork, Lightbulb, ShieldAlert, ArrowRight } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import ConfidenceBadge from '../common/ConfidenceBadge';
import RequirementEvidence from './RequirementEvidence';

export default function IssueDetailModal({ issue, requirements = [], onClose }) {
  if (!issue) return null;

  const isContradiction = issue.type === 'contradiction' || issue.requirementA !== undefined;
  const isAmbiguity = issue.type === 'ambiguity' || issue.requirementId !== undefined;
  const isMissing = issue.type === 'missingInformation' || issue.missingTopic !== undefined;
  const isDependency = issue.dependencyType !== undefined;

  // Lookup requirements
  const reqA = isContradiction ? requirements.find(r => r.id === issue.requirementA) : null;
  const reqB = isContradiction ? requirements.find(r => r.id === issue.requirementB) : null;
  const reqSingle = isAmbiguity ? requirements.find(r => r.id === issue.requirementId) : null;
  const relatedReqs = isMissing && Array.isArray(issue.relatedRequirementIds)
    ? requirements.filter(r => issue.relatedRequirementIds.includes(r.id))
    : [];

  const sourceReq = isDependency ? requirements.find(r => r.id === issue.sourceRequirementId) : null;
  const targetReq = isDependency ? requirements.find(r => r.id === issue.targetRequirementId) : null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}
    onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span className={`badge ${
                isContradiction ? 'badge-contradiction' :
                isAmbiguity ? 'badge-ambiguity' :
                isMissing ? 'badge-missing' : 'badge-dependency'
              }`}>
                {isContradiction && <AlertTriangle size={12} />}
                {isAmbiguity && <HelpCircle size={12} />}
                {isMissing && <FileQuestion size={12} />}
                {isDependency && <GitFork size={12} />}
                <span>
                  {isContradiction ? 'Potential Contradiction' :
                   isAmbiguity ? 'Ambiguity Warning' :
                   isMissing ? `Missing Information: ${issue.missingTopic}` : 'Dependency'}
                </span>
              </span>

              {!isDependency && <SeverityBadge severity={issue.severity} />}
              {!isDependency && <ConfidenceBadge confidence={issue.confidence} />}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Issue Investigation: {issue.id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '0.4rem' }}
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Evidence Section */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem'
          }}>
            Source Evidence & Requirements
          </h4>

          {isContradiction && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <RequirementEvidence
                req={reqA}
                label="Requirement A"
                highlightColor="var(--cat-contradiction)"
              />
              <RequirementEvidence
                req={reqB}
                label="Requirement B"
                highlightColor="var(--accent-light)"
              />
            </div>
          )}

          {isAmbiguity && (
            <RequirementEvidence
              req={reqSingle}
              label="Subject Requirement"
              highlightColor="var(--cat-ambiguity)"
            />
          )}

          {isMissing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {relatedReqs.length > 0 ? (
                relatedReqs.map(r => (
                  <RequirementEvidence
                    key={r.id}
                    req={r}
                    label="Related Context Requirement"
                    highlightColor="var(--cat-missing)"
                  />
                ))
              ) : (
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    This missing detail applies across the system specification rather than a single requirement ID.
                  </p>
                </div>
              )}
            </div>
          )}

          {isDependency && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <RequirementEvidence
                req={sourceReq}
                label="Prerequisite (Source)"
                highlightColor="var(--cat-dependency)"
              />
              <RequirementEvidence
                req={targetReq}
                label="Dependent (Target)"
                highlightColor="var(--accent-light)"
              />
            </div>
          )}
        </div>

        {/* Deep Analysis & Impact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)' }}>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.95rem',
              color: 'var(--accent-light)',
              marginBottom: '0.5rem'
            }}>
              <ShieldAlert size={16} />
              <span>Why This Potential Issue Was Flagged</span>
            </h4>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {issue.explanation}
            </p>
          </div>

          {issue.impact && (
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{
                fontSize: '0.95rem',
                color: '#f43f5e',
                marginBottom: '0.5rem'
              }}>
                Implementation & Operational Impact
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {issue.impact}
              </p>
            </div>
          )}

          {issue.suggestedClarification && (
            <div className="glass-panel" style={{
              padding: '1.25rem',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)'
            }}>
              <h4 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.95rem',
                color: 'var(--accent-light)',
                marginBottom: '0.5rem'
              }}>
                <Lightbulb size={16} />
                <span>Suggested Actionable Clarification</span>
              </h4>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {issue.suggestedClarification}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
