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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
        <Filter className="w-3.5 h-3.5 text-blue-600" />
        <span>Filter Inspections</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">Filter By</label>
          <select 
            value={selectedType} 
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg h-9 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {Object.entries(FILTER_CONFIG).map(([key, conf]) => (
              <option key={key} value={key}>{conf.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">Value</label>
          {FILTER_CONFIG[selectedType].type === 'select' ? (
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg h-9 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg h-9 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleAddFilter}
        className="w-full bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Filter</span>
      </button>

      {activeFilters.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5 items-center">
            {activeFilters.map((f) => (
              <span 
                key={f.type} 
                className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-medium px-2 py-0.5 rounded-full"
              >
                <strong>{f.label}:</strong> {f.value}
                <button 
                  onClick={() => handleRemove(f.type)}
                  className="hover:text-blue-900 p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button 
              onClick={() => onFilterChange([])}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-auto py-0.5"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
