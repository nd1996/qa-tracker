import React, { useState } from 'react';
import { Filter, X, Plus } from 'lucide-react';

const FILTER_CONFIG = {
  severity: { label: 'Severity', type: 'select', options: ['Critical', 'Major', 'Minor'] },
  status: { label: 'Status', type: 'select', options: ['Open', 'Resolved'] },
  defectType: { 
    label: 'Defect Type', 
    type: 'select', 
    options: ['Weave Defect', 'Shade Variation', 'Hole/Tear', 'Count Deviation', 'Other'] 
  },
  lineId: { label: 'Line / Machine ID', type: 'text' },
  fromDate: { label: 'From Date', type: 'date' },
  toDate: { label: 'To Date', type: 'date' }
};

export const DynamicFilter = ({ activeFilters, onFilterChange }) => {
  const [selectedType, setSelectedType] = useState('severity');
  const [selectedValue, setSelectedValue] = useState('Critical');

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const cfg = FILTER_CONFIG[type];
    setSelectedValue(cfg.type === 'select' && cfg.options ? cfg.options[0] : '');
  };

  const handleAddFilter = () => {
    if (!selectedValue.toString().trim()) return;
    const existingIndex = activeFilters.findIndex((f) => f.type === selectedType);
    let updated = [...activeFilters];
    const newChip = {
      type: selectedType,
      label: FILTER_CONFIG[selectedType].label,
      value: selectedValue
    };

    if (existingIndex > -1) {
      updated[existingIndex] = newChip;
    } else {
      updated.push(newChip);
    }

    onFilterChange(updated);
  };

  const handleRemove = (type) => {
    onFilterChange(activeFilters.filter((f) => f.type !== type));
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm mb-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2.5">
        <Filter className="w-3.5 h-3.5 text-blue-400" />
        <span className="uppercase tracking-wider text-[11px]">Filter Inspections</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div>
          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Filter By</label>
          <select 
            value={selectedType} 
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full text-xs bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-xl h-9 px-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            {Object.entries(FILTER_CONFIG).map(([key, conf]) => (
              <option key={key} value={key}>{conf.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Value</label>
          {FILTER_CONFIG[selectedType].type === 'select' ? (
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full text-xs bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-xl h-9 px-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {FILTER_CONFIG[selectedType].options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input 
              type={FILTER_CONFIG[selectedType].type}
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full text-xs bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-xl h-9 px-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleAddFilter}
        className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 text-blue-400" />
        <span>Add Filter</span>
      </button>

      {activeFilters.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5 items-center">
            {activeFilters.map((f) => (
              <span 
                key={f.type} 
                className="inline-flex items-center gap-1.5 bg-blue-950/50 border border-blue-800/60 text-blue-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
              >
                <strong>{f.label}:</strong> {f.value}
                <button 
                  onClick={() => handleRemove(f.type)}
                  className="hover:text-white p-0.5 rounded-full transition"
                >
                  <X className="w-3 h-3 text-blue-400 hover:text-white" />
                </button>
              </span>
            ))}
            <button 
              onClick={() => onFilterChange([])}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-auto py-0.5"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
