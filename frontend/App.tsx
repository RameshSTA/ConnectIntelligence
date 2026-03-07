/**
 * App — Root component and page router
 * =======================================
 * Orchestrates the fixed sidebar + scrollable main content layout.
 * Fetches the primary member dataset on mount and passes it down to views
 * that need it (Segmentation, MemberExplorer).
 *
 * Tab-based routing (no URL changes) via `activeTab` state.
 *
 * Deployment:
 *   Frontend → Vercel
 *   Backend  → Render  (API_BASE resolved centrally in config.ts)
 */

import React, { useState, useEffect } from 'react';
import Sidebar             from './components/Sidebar';
import Overview            from './components/Overview';
import Segmentation        from './components/Segmentation';
import MemberExplorer      from './components/MemberExplorer';
import FeatureImportance   from './components/FeatureImportance';
import DataAudit           from './components/DataAudit';
import MLPipeline          from './components/MLPipeline';
import PredictionSimulator from './components/PredictionSimulator';
import { Member, PortfolioMetrics } from './types';
import { API_BASE }        from './config';
import { Menu, Github, Linkedin, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab,        setActiveTab]        = useState<string>('overview');
  const [members,          setMembers]          = useState<Member[]>([]);
  const [metrics,          setMetrics]          = useState<PortfolioMetrics | null>(null);
  const [appLoading,       setAppLoading]       = useState<boolean>(true);
  const [appError,         setAppError]         = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Fetch the primary member dataset shared by Overview, Segmentation & MemberExplorer
  const fetchMembers = async () => {
    setAppLoading(true);
    setAppError(null);
    try {
      const res = await fetch(`${API_BASE}/api/members`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMembers(json.members ?? []);
      setMetrics(json.metrics ?? null);
    } catch {
      setAppError(
        'Could not reach the inference server. It may be waking up — please wait 30 s and retry.'
      );
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Full-page loading spinner while the initial fetch completes
  if (appLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Connect Intelligence
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

      {/* ── Sidebar navigation ────────────────────────────────────────── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile overlay — closes sidebar when tapping outside */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64 overflow-x-hidden">

        {/* Sticky top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <Cpu size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800">Connect Intelligence</span>
            <span className="hidden sm:inline text-xs text-slate-400">
              — Superannuation Retention Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            {appError && (
              <button
                onClick={fetchMembers}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <RefreshCw size={12} /> Reconnect
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">System Online</span>
            </div>
          </div>
        </header>

        {/* Connection error banner */}
        {appError && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <p className="text-sm font-medium text-amber-800">{appError}</p>
          </div>
        )}

        {/* Routed page content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'overview'     && (
            <Overview metrics={metrics} onNavigate={handleTabChange} />
          )}
          {activeTab === 'ml-lifecycle' && (
            <MLPipeline onLaunchPredictor={() => handleTabChange('simulator')} />
          )}
          {activeTab === 'simulator'    && <PredictionSimulator />}
          {activeTab === 'segmentation' && <Segmentation data={members} />}
          {activeTab === 'members'      && <MemberExplorer data={members} />}
          {activeTab === 'insights'     && <FeatureImportance />}
          {activeTab === 'data-quality' && <DataAudit />}
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Ramesh Shrestha</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Data Scientist &amp; Machine Learning Engineer
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a
                href="https://github.com/RameshSTA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                <Github size={15} /> GitHub
              </a>
              <span className="text-slate-200">|</span>
              <a
                href="https://www.linkedin.com/in/rameshsta/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-400">
                © {new Date().getFullYear()} All rights reserved
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
