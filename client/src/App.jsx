import React, { useState, useEffect, useCallback } from 'react';
import { 
  apiFetch, 
  getAuthToken, 
  setAuthToken, 
  getCurrentUser, 
  setCurrentUser, 
  removeAuthToken, 
  removeCurrentUser 
} from './utils/api';
import { getOfflineQueue, addToOfflineQueue, clearOfflineQueue } from './utils/offlineQueue';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { DynamicFilter } from './components/DynamicFilter';
import { InspectionList } from './components/InspectionList';
import { LogInspectionModal } from './components/LogInspectionModal';
import { ResolveModal } from './components/ResolveModal';
import { Plus, ShieldAlert } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [token, setToken] = useState(getAuthToken());

  // Login Form State
  const [username, setUsername] = useState('supervisor_a');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [inspections, setInspections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalRecords: 0, totalPages: 1 });
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilters, setActiveFilters] = useState([]);

  // Modals & Offline Status
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [resolvingItem, setResolvingItem] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(getOfflineQueue().length);

  const flushOfflineQueue = useCallback(async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        await apiFetch('/inspections', {
          method: 'POST',
          body: JSON.stringify(item),
        });
      } catch (e) {
        console.error('Failed to sync offline item', e);
      }
    }
    clearOfflineQueue();
    setPendingSyncCount(0);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushOfflineQueue().then(() => fetchData());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOfflineQueue]);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortOrder,
      });

      activeFilters.forEach((f) => {
        params.append(f.type, f.value);
      });

      const [listRes, summaryRes] = await Promise.all([
        apiFetch(`/inspections?${params.toString()}`),
        apiFetch('/inspections/summary'),
      ]);

      setInspections(listRes.data);
      setPagination(listRes.pagination);
      setSummary(summaryRes);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  }, [token, pagination.page, pagination.limit, sortOrder, activeFilters]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [fetchData, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setAuthToken(res.token);
      setCurrentUser(res.user);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeCurrentUser();
    setToken(null);
    setUser(null);
  };

  const handleCreateInspection = async (payload) => {
    if (!isOnline) {
      addToOfflineQueue(payload);
      setPendingSyncCount(getOfflineQueue().length);
      alert('Offline: Inspection saved locally and will auto-sync when back online.');
      return;
    }

    try {
      await apiFetch('/inspections', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      fetchData();
    } catch (err) {
      alert('Failed to save inspection: ' + err.message);
    }
  };

  const handleResolveInspection = async (id, resolutionNote) => {
    try {
      await apiFetch(`/inspections/${id}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ resolutionNote }),
      });
      fetchData();
    } catch (err) {
      alert('Failed to resolve inspection: ' + err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">ShopFloor QA Tracker</h1>
            <p className="text-xs text-slate-400">Supervisor Portal Login</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs bg-slate-800 text-slate-100 border border-slate-700 rounded-xl p-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-800 text-slate-100 border border-slate-700 rounded-xl p-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-md"
            >
              Sign In to Floor
            </button>
          </form>

          <div className="mt-5 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-[11px] text-slate-300">
            <strong className="text-slate-200">Demo Credentials:</strong>
            <div className="mt-1 flex justify-between">
              <span>Shift A: <code>supervisor_a / admin123</code></span>
            </div>
            <div className="flex justify-between">
              <span>Shift B: <code>supervisor_b / admin123</code></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        user={user}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onLogout={handleLogout}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Main Container: Single column on Mobile, 2-Column Dashboard on Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Left Column: Metrics & Filter Controls */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <SummaryCards summary={summary} />
            <DynamicFilter
              activeFilters={activeFilters}
              onFilterChange={(filters) => {
                setActiveFilters(filters);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </aside>

          {/* Right Column: Feed / Data Table */}
          <section className="lg:col-span-8 mt-4 lg:mt-0">
            <InspectionList
              inspections={inspections}
              pagination={pagination}
              sortOrder={sortOrder}
              onSortToggle={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              onPageSizeChange={(limit) => setPagination((prev) => ({ ...prev, limit, page: 1 }))}
              onOpenResolve={(item) => setResolvingItem(item)}
            />
          </section>
        </div>
      </main>

      {/* Sticky Bottom Action Button for Mobile Only (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 z-20">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-blue-950 flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Quality Inspection</span>
          </button>
        </div>
      </div>

      <LogInspectionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleCreateInspection}
      />

      <ResolveModal
        inspection={resolvingItem}
        onClose={() => setResolvingItem(null)}
        onResolve={handleResolveInspection}
      />
    </div>
  );
}
