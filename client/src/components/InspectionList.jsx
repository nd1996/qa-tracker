import React from 'react';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, User, Clock, ArrowUpDown } from 'lucide-react';

export const InspectionList = ({ 
  inspections, 
  pagination, 
  sortOrder,
  onSortToggle,
  onPageChange, 
  onPageSizeChange,
  onOpenResolve 
}) => {
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200 border-l-4 border-l-rose-500';
      case 'Major':
        return 'bg-amber-100 text-amber-800 border-amber-200 border-l-4 border-l-amber-500';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className="mb-20">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-slate-700">
          Inspections ({pagination.totalRecords})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onSortToggle}
            className="flex items-center gap-1 text-[11px] font-medium bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-600"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          <select
            value={pagination.limit}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-600"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>

      {/* List Feed */}
      {inspections.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-400 text-xs">
          No inspection records found matching your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {inspections.map((item) => {
            const isResolved = item.status === 'Resolved';
            return (
              <div 
                key={item.id}
                className={`bg-white rounded-xl p-3.5 border transition shadow-sm ${
                  isResolved ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{item.lineId}</span>
                    <span className="text-xs text-slate-500 block">{item.defectType}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isResolved 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Remarks / Notes */}
                {item.remarks && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-2">
                    {item.remarks}
                  </p>
                )}

                {/* Resolution Details */}
                {isResolved && item.resolutionNote && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2 mb-2 text-xs">
                    <div className="flex items-center gap-1 text-emerald-800 font-semibold text-[11px] mb-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Resolved by {item.resolvedBy?.username || 'Supervisor'}</span>
                    </div>
                    <p className="text-emerald-900">{item.resolutionNote}</p>
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.loggedBy?.username || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => onOpenResolve(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-[11px] px-3 py-1 rounded-lg transition"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 mt-4">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(pagination.page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-medium text-slate-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
