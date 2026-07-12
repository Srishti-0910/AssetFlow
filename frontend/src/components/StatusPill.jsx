import React from 'react';

const colors = {
  available: '#2DD4BF',
  allocated: '#F5A623',
  maintenance: '#F85149',
  retired: '#8B949E',
  active: '#2DD4BF',
  returned: '#8B949E',
  overdue: '#F85149',
  scheduled: '#F5A623',
  in_progress: '#F5A623',
  completed: '#2DD4BF',
};

export default function StatusPill({ status }) {
  const color = colors[status] || '#8B949E';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-muted">
      <span className="status-dot" style={{ backgroundColor: color }} />
      {status?.replace('_', ' ')}
    </span>
  );
}
