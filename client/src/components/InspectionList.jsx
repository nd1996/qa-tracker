import React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, User, Clock, ArrowUpDown } from 'lucide-react';

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
        return 'bg-rose-950/40 text-rose-400 border-rose-900/60';
      case 'Major':
        return 'bg-amber-950/40 text-amber-400 border-amber-900/60';
      default:
        return 'bg-blue-950/40 text-blue-400 border-blue-900/60';
    }
  };

  const getBorderAccent = (sev, isResolved) => {
    if (isResolved) return 'border-l-2 border-l-emerald-500/70';
    switch (sev) {
      case 'Critical':
        return 'border-l-2 border-l-rose-500';
      case 'Major':
        return 'border-l-2 border-l-amber-500';
      default:
        return 'border-l-2 border-l-blue-500';
    }
  };

  return (
    <div className="mb-20 lg:mb-0">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Inspections Log ({pagination.totalRecords})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onSortToggle}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl hover:border-slate-700 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>

          <select
            value={pagination.limit}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>

      {inspections.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No inspection records found matching your active filters.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< lg): Stacked Cards */}
          <div className="space-y-3 lg:hidden">
            {inspections.map((item) => {
              const isResolved = item.status === 'Resolved';
              return (
                <div 
                  key={item.id}
                  className={`bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 shadow-sm transition ${getBorderAccent(item.severity, isResolved)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-bold text-sm text-slate-100">{item.lineId}</span>
                      <span className="text-xs text-slate-400 block">{item.defectType}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isResolved 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' 
                          : 'bg-rose-950/40 text-rose-400 border-rose-900/60'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {item.remarks && (
                    <p className="text-xs text-slate-300 bg-slate-800/70 border border-slate-800 p-2.5 rounded-lg mb-2 leading-relaxed break-words whitespace-normal">
                      {item.remarks}
                    </p>
                  )}

                  {isResolved && item.resolutionNote && (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2.5 mb-2 text-xs">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] mb-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved by {item.resolvedBy?.username || 'Supervisor'}</span>
                      </div>
                      <p className="text-emerald-300 leading-relaxed break-words whitespace-normal">{item.resolutionNote}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.loggedBy?.username || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(item.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => onOpenResolve(item)}
                        className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1 rounded-lg transition"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW (>= lg): Data Table with Proper Text Wrapping */}
          <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs table-fixed">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-28">Line ID</th>
                  <th className="py-3.5 px-4 w-36">Defect</th>
                  <th className="py-3.5 px-4 w-24">Severity</th>
                  <th className="py-3.5 px-4 w-24">Status</th>
                  <th className="py-3.5 px-4 w-36">Attribution</th>
                  <th className="py-3.5 px-4">Remarks & Resolution</th>
                  <th className="py-3.5 px-4 text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {inspections.map((item) => {
                  const isResolved = item.status === 'Resolved';
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition items-start">
                      <td className="py-3.5 px-4 font-bold text-slate-100 align-top">{item.lineId}</td>
                      <td className="py-3.5 px-4 text-slate-300 align-top">{item.defectType}</td>
                      <td className="py-3.5 px-4 align-top">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isResolved ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-rose-950/40 text-rose-400 border-rose-900/60'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-400 align-top">
                        <div className="text-slate-200 font-medium">{item.loggedBy?.username}</div>
                        <div>{new Date(item.loggedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                      </td>
                      
                      {/* Fully Wrapped Remarks & Resolution Column */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1.5">
                          {item.remarks ? (
                            <div className="text-slate-300 text-xs leading-relaxed break-words whitespace-normal">
                              {item.remarks}
                            </div>
                          ) : (
                            <span className="text-slate-600 italic text-[11px]">No remarks</span>
                          )}

                          {isResolved && item.resolutionNote && (
                            <div className="text-[11px] bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 p-2 rounded-lg leading-relaxed break-words whitespace-normal">
                              <span className="font-semibold text-emerald-400 block mb-0.5">
                                ✓ Resolved by {item.resolvedBy?.username || 'Supervisor'}:
                              </span>
                              {item.resolutionNote}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right align-top">
                        {!isResolved ? (
                          <button
                            onClick={() => onOpenResolve(item)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 mt-4">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(pagination.page - 1)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-medium text-slate-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
