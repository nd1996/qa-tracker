import React from 'react';
import { Wifi, WifiOff, LogOut, ClipboardCheck } from 'lucide-react';

export const Navbar = ({ user, isOnline, pendingSyncCount, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-base font-bold leading-tight">QA Tracker</h1>
            <p className="text-[10px] text-slate-400">{user?.shift || 'Shop-Floor'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
            isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? (pendingSyncCount > 0 ? `Syncing (${pendingSyncCount})` : 'Online') : `Offline (${pendingSyncCount})`}</span>
          </div>

          <button 
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
