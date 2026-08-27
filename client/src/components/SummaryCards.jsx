import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';

export const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Open Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Open</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">{summary.open?.total || 0}</div>
          </div>
          <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
            <AlertOctagon className="w-4 h-4" />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px] font-medium pt-2 border-t border-slate-700/60 text-slate-300 text-center">
          <div className="bg-rose-950/40 border border-rose-900/40 rounded py-0.5 text-rose-300">
            <span className="block text-[8px] text-slate-400">CRIT</span>{summary.open?.Critical || 0}
          </div>
          <div className="bg-amber-950/40 border border-amber-900/40 rounded py-0.5 text-amber-300">
            <span className="block text-[8px] text-slate-400">MAJ</span>{summary.open?.Major || 0}
          </div>
          <div className="bg-blue-950/40 border border-blue-900/40 rounded py-0.5 text-blue-300">
            <span className="block text-[8px] text-slate-400">MIN</span>{summary.open?.Minor || 0}
          </div>
        </div>
      </div>

      {/* Resolved Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{summary.resolved?.total || 0}</div>
          </div>
          <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[10px] font-medium pt-2 border-t border-slate-700/60 text-slate-300 text-center">
          <div className="bg-rose-950/40 border border-rose-900/40 rounded py-0.5 text-rose-300">
            <span className="block text-[8px] text-slate-400">CRIT</span>{summary.resolved?.Critical || 0}
          </div>
          <div className="bg-amber-950/40 border border-amber-900/40 rounded py-0.5 text-amber-300">
            <span className="block text-[8px] text-slate-400">MAJ</span>{summary.resolved?.Major || 0}
          </div>
          <div className="bg-blue-950/40 border border-blue-900/40 rounded py-0.5 text-blue-300">
            <span className="block text-[8px] text-slate-400">MIN</span>{summary.resolved?.Minor || 0}
          </div>
        </div>
      </div>
    </div>
  );
};