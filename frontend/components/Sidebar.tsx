/**
 * Sidebar — Main navigation component
 * ======================================
 * Fixed left-hand navigation with brand header, menu items, and a
 * live system status footer. Collapses off-screen on mobile and
 * toggles via the hamburger button in the header.
 */

import React from 'react';
import { Network, GitMerge, Calculator, Database, PieChart, Activity, Users, X } from 'lucide-react';

/** Describes a single navigation item. */
interface NavItem {
  id:    string;
  label: string;
  icon:  React.ElementType;
  desc:  string;
}

interface SidebarProps {
  activeTab:       string;
  setActiveTab:    (tab: string) => void;
  isOpen:          boolean;
  closeMobileMenu: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'ml-lifecycle', label: 'ML Pipeline',       icon: GitMerge,   desc: 'End-to-end model lifecycle'   },
  { id: 'simulator',    label: 'Live Predictor',     icon: Calculator, desc: 'Real-time risk inference'     },
  { id: 'data-quality', label: 'Data Audit',         icon: Database,   desc: 'Quality & integrity report'   },
  { id: 'segmentation', label: 'Segmentation',       icon: PieChart,   desc: 'K-Means cluster analysis'     },
  { id: 'insights',     label: 'Model Performance',  icon: Activity,   desc: 'Evaluation metrics & XAI'     },
  { id: 'members',      label: 'Member Ledger',      icon: Users,      desc: 'Full member risk registry'    },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  closeMobileMenu,
}) => (
  <aside
    className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col
      border-r border-slate-800 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
    `}
  >
    {/* ── Brand header ─────────────────────────────────────────────── */}
    <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Network size={18} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none tracking-tight">Connect</p>
          <p className="text-xs text-slate-400 mt-0.5">Intelligence</p>
        </div>
      </div>
      <button
        onClick={closeMobileMenu}
        className="lg:hidden p-1.5 text-slate-500 hover:text-white transition-colors rounded"
        aria-label="Close menu"
      >
        <X size={18} />
      </button>
    </div>

    {/* ── Navigation links ──────────────────────────────────────────── */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
        Analytics
      </p>

      {NAV_ITEMS.map(({ id, label, icon: Icon, desc }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            title={desc}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
              transition-colors duration-150 group
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }
            `}
          >
            <Icon
              size={16}
              className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}
            />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </nav>

    {/* ── System status footer ──────────────────────────────────────── */}
    <div className="px-4 py-4 border-t border-slate-800">
      <div className="bg-slate-800/60 rounded-lg px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">System Status</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Online
          </span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>XGBoost Engine</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
          <div className="flex justify-between">
            <span>FastAPI Server</span>
            <span className="text-emerald-400 font-medium">v2.0.0</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
