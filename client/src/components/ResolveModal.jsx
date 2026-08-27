import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export const ResolveModal = ({ inspection, onClose, onResolve }) => {
  const [resolutionNote, setResolutionNote] = useState('');
  const [error, setError] = useState('');

  if (!inspection) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      setError('Resolution note is mandatory.');
      return;
    }

    onResolve(inspection.id, resolutionNote.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Resolve Defect #{inspection.id}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="font-bold text-slate-800">{inspection.lineId} — {inspection.defectType}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Severity: {inspection.severity}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mandatory Resolution Note *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail actions taken (e.g. replaced tension spring, recalibrated roller speed)..."
              value={resolutionNote}
              onChange={(e) => {
                setResolutionNote(e.target.value);
                if (error) setError('');
              }}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold py-3 rounded-xl transition"
          >
            Confirm & Close Defect
          </button>
        </form>
      </div>
    </div>
  );
};
