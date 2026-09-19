import React from 'react';
import { ArrowRight, AlertTriangle, HelpCircle, FileQuestion, GitFork, ArrowLeftRight } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import ConfidenceBadge from '../common/ConfidenceBadge';

export default function IssueCard({ issue, category, onClick }) {
  const isContradiction = category === 'contradictions' || issue.type === 'contradiction';
  const isAmbiguity = category === 'ambiguities' || issue.type === 'ambiguity';
  const isMissing = category === 'missing' || issue.type === 'missingInformation';
  const isDependency = category === 'dependencies' || issue.dependencyType !== undefined;

  let typeBadgeClass = 'badge-contradiction';
  let TypeIcon = AlertTriangle;
  let typeLabel = 'Potential Contradiction';

  if (isAmbiguity) {
    typeBadgeClass = 'badge-ambiguity';
    TypeIcon = HelpCircle;
    typeLabel = 'Ambiguous Requirement';
  } else if (isMissing) {
    typeBadgeClass = 'badge-missing';
    TypeIcon = FileQuestion;
    typeLabel = `Missing Info: ${issue.missingTopic || 'Specification'}`;
  } else if (isDependency) {
    typeBadgeClass = 'badge-dependency';
    TypeIcon = GitFork;
    typeLabel = 'Dependency Relationship';
  }

  return (
    <div
      className="glass-panel"
      onClick={onClick}
      style={{
        padding: '1.25rem 1.5rem',
        cursor: 'pointer',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className={`badge ${typeBadgeClass}`}>
            <TypeIcon size={12} />
            <span>{typeLabel}</span>
          </span>

          {!isDependency && <SeverityBadge severity={issue.severity} />}
          {!isDependency && <ConfidenceBadge confidence={issue.confidence} />}
        </div>

        {/* Requirements involved tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.2rem 0.5rem',
          borderRadius: '6px'
        }}>
          {isContradiction && (
            <>
              <span>{issue.requirementA}</span>
              <ArrowLeftRight size={12} color="var(--cat-contradiction)" />
              <span>{issue.requirementB}</span>
            </>
          )}
          {isAmbiguity && <span>{issue.requirementId}</span>}
          {isMissing && (
            <span>
              {(issue.relatedRequirementIds && issue.relatedRequirementIds.length > 0)
                ? issue.relatedRequirementIds.join(', ')
                : 'General Constraint'}
            </span>
          )}
          {isDependency && (
            <>
              <span>{issue.sourceRequirementId}</span>
              <ArrowRight size={12} color="var(--cat-dependency)" />
              <span>{issue.targetRequirementId}</span>
            </>
          )}
        </div>
      </div>

      <p style={{
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        lineHeight: 1.5,
        marginBottom: '0.85rem'
      }}>
        {issue.explanation}
      </p>

      {/* Suggested Clarification Preview */}
      {issue.suggestedClarification && (
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          borderLeft: '2px solid var(--accent-light)',
          paddingLeft: '0.75rem',
          marginBottom: '0.85rem'
        }}>
          <strong style={{ color: 'var(--accent-light)' }}>Clarification: </strong>
          {issue.suggestedClarification}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.35rem',
        fontSize: '0.85rem',
        color: 'var(--accent-light)',
        fontWeight: 500
      }}>
        <span>Investigate Evidence</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}
