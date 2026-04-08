import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    Pending: { bg: '#FEF9C3', color: '#854D0E', dot: '#FACC15' },
    Accepted: { bg: '#DCFCE7', color: '#14532D', dot: '#22C55E' },
    Rejected: { bg: '#FEE2E2', color: '#7F1D1D', dot: '#EF4444' },
  };

  const c = config[status] || config.Pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
