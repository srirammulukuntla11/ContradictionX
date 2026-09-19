import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function SeverityBadge({ severity = 'medium' }) {
  const norm = (severity || 'medium').toLowerCase();

  let badgeClass = 'badge-sev-medium';
  let Icon = AlertCircle;
  let label = 'Medium Severity';

  if (norm === 'high') {
    badgeClass = 'badge-sev-high';
    Icon = AlertTriangle;
    label = 'High Severity';
  } else if (norm === 'low') {
    badgeClass = 'badge-sev-low';
    Icon = Info;
    label = 'Low Severity';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={12} />
      <span>{label}</span>
    </span>
  );
}
