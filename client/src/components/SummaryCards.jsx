import React from 'react';

export const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {/* Open Card */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">Open</span>
          <span className="text-lg font-black text-red-800">{summary.open?.total || 0}</span>
        </div>
        <div className="flex justify-between text-[11px] text-red-600 border-t border-red-200 pt-1 mt-1">
          <span>Crit: <strong>{summary.open?.Critical || 0}</strong></span>
          <span>Maj: <strong>{summary.open?.Major || 0}</strong></span>
          <span>Min: <strong>{summary.open?.Minor || 0}</strong></span>
        </div>
      </div>

      {/* Resolved Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Resolved</span>
          <span className="text-lg font-black text-emerald-800">{summary.resolved?.total || 0}</span>
        </div>
        <div className="flex justify-between text-[11px] text-emerald-600 border-t border-emerald-200 pt-1 mt-1">
          <span>Crit: <strong>{summary.resolved?.Critical || 0}</strong></span>
          <span>Maj: <strong>{summary.resolved?.Major || 0}</strong></span>
          <span>Min: <strong>{summary.resolved?.Minor || 0}</strong></span>
        </div>
      </div>
    </div>
  );
};
