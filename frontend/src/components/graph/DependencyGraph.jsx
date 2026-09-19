import React, { useMemo, useState } from 'react';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, List, Info } from 'lucide-react';
import DependencyList from './DependencyList';

export default function DependencyGraph({ dependencies = [], requirements = [] }) {
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'list'

  // Map requirements to nodes
  const { nodes, edges } = useMemo(() => {
    const reqMap = new Map(requirements.map(r => [r.id, r]));

    // Find all requirement IDs that participate in dependencies
    const connectedReqIds = new Set();
    dependencies.forEach(d => {
      connectedReqIds.add(d.sourceRequirementId);
      connectedReqIds.add(d.targetRequirementId);
    });

    const activeReqs = requirements.filter(r => connectedReqIds.has(r.id));
    // If no explicit connections, show first few requirements
    const displayReqs = activeReqs.length > 0 ? activeReqs : requirements.slice(0, 6);

    // Arrange in 2 or 3 columns
    const computedNodes = displayReqs.map((req, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);

      return {
        id: req.id,
        position: { x: col * 320 + 40, y: row * 160 + 40 },
        data: {
          label: (
            <div style={{ textAlign: 'left' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <strong style={{ color: 'var(--accent-light)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {req.id}
                </strong>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  P.{req.page || 1}
                </span>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                maxHeight: '48px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {req.text.length > 65 ? req.text.substring(0, 65) + '...' : req.text}
              </div>
            </div>
          )
        },
        style: {
          background: 'var(--bg-surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '12px',
          width: 260,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }
      };
    });

    const computedEdges = dependencies.map((dep, idx) => ({
      id: dep.id || `edge-${idx}`,
      source: dep.sourceRequirementId,
      target: dep.targetRequirementId,
      label: dep.dependencyType || 'pre-condition',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'var(--font-mono)' },
      labelBgStyle: { fill: '#0f1523', fillOpacity: 0.9 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
        width: 16,
        height: 16
      }
    }));

    return { nodes: computedNodes, edges: computedEdges };
  }, [dependencies, requirements]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network size={18} color="var(--cat-dependency)" />
            <span>Requirement Dependency Topology</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Directed graph mapping prerequisite sequences and cross-document dependencies
          </p>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg-surface)',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setViewMode('graph')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              background: viewMode === 'graph' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'graph' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <Network size={14} />
            <span>Interactive Graph</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            <List size={14} />
            <span>Traceability List</span>
          </button>
        </div>
      </div>

      {viewMode === 'graph' ? (
        <div style={{
          width: '100%',
          height: '480px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#0a0e1a',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          {nodes.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#1e293b" gap={16} size={1} />
              <Controls />
            </ReactFlow>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              No graph nodes available.
            </div>
          )}
        </div>
      ) : (
        <DependencyList dependencies={dependencies} requirements={requirements} />
      )}
    </div>
  );
}
