import React from 'react';
import { Gauge } from 'lucide-react';

export default function ConfidenceBadge({ confidence = 0.85 }) {
  // Convert 0.0 - 1.0 to percentage
  const num = typeof confidence === 'number' ? confidence : 0.85;
  const percentage = Math.round(num <= 1 ? num * 100 : num);

  return (
    <span
      className="badge badge-confidence"
      title="Model confidence in this potential finding"
    >
      <Gauge size={12} />
      <span>{percentage}% Confidence</span>
    </span>
  );
}
