import React from 'react';
import { Wifi, WifiOff, LogOut, ClipboardCheck } from 'lucide-react';

export const Navbar = ({ user, isOnline, pendingSyncCount, onLogout, onOpenLogModal }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight tracking-tight">QA Tracker</h1>
            <p className="text-[11px] text-slate-400">{user?.shift || 'Shop-Floor'} • {user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Direct Log Button */}
          <button
            onClick={onOpenLogModal}
            className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            + New Inspection
          </button>

          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
            isOnline ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80' : 'bg-amber-950/60 text-amber-400 border border-amber-800/80'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="font-medium">{isOnline ? (pendingSyncCount > 0 ? `Syncing (${pendingSyncCount})` : 'Online') : `Offline (${pendingSyncCount})`}</span>
          </div>

          <button 
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
