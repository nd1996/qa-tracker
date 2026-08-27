import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

const DEFECT_TYPES = ['Weave Defect', 'Shade Variation', 'Hole/Tear', 'Count Deviation', 'Other'];
const SEVERITY_LEVELS = ['Critical', 'Major', 'Minor'];

export const LogInspectionModal = ({ isOpen, onClose, onSubmit }) => {
  const [lineId, setLineId] = useState('');
  const [defectType, setDefectType] = useState(DEFECT_TYPES[0]);
  const [severity, setSeverity] = useState('Critical');
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lineId.trim()) return;

    onSubmit({
      lineId: lineId.trim(),
      defectType,
      severity,
      remarks: remarks.trim()
    });

    setLineId('');
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Log Quality Inspection</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Machine / Line ID *
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Loom-04, Spinning-2"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Defect Type *
            </label>
            <select
              value={defectType}
              onChange={(e) => setDefectType(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {DEFECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SEVERITY_LEVELS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    severity === s
                      ? s === 'Critical'
                        ? 'bg-red-600 text-white border-red-600'
                        : s === 'Major'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add defect notes, batch numbers, or context..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold py-3 rounded-xl transition"
            >
              Submit Inspection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
