import React from 'react';
import { 
  LayoutDashboard, Users, PieChart, Activity, FileText, 
  Database, GitMerge, Calculator, X, Network, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, closeMobileMenu }) => {
  const menuItems = [
    { id: 'ml-lifecycle', label: 'ML Lifecycle', icon: GitMerge },
    { id: 'simulator', label: 'Live Predictor', icon: Calculator },
    { id: 'data-quality', label: 'Data Audit & Prep', icon: Database },
    { id: 'segmentation', label: 'Segmentation | Clustering', icon: PieChart },
    { id: 'insights', label: 'Model Performance', icon: Activity },
    { id: 'members', label: 'Member Predictions', icon: Users },
   
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white shadow-2xl transform transition-transform duration-300 ease-in-out font-sans flex flex-col border-r border-slate-800/50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}
    >
      {/* REDESIGNED BRAND HEADER */}
      <div className="p-8 border-b border-slate-800/50 relative overflow-hidden">
        {/* Aesthetic Background Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          {/* Branded Logo Icon */}
          <div className="h-11 w-11 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
            <Network size={24} className="text-white" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white leading-none">
              CONNECT
            </span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mt-1 opacity-80">
              Intelligence
            </span>
          </div>
        </div>

        <button onClick={closeMobileMenu} className="lg:hidden absolute right-6 top-9 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION - Premium Interaction Design */}
      <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Icon 
                  size={18} 
                  className={`transition-all duration-300 ${isActive ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-500 group-hover:text-indigo-400'}`} 
                />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-indigo-300 animate-in slide-in-from-left-2" />}
            </button>
          );
        })}
      </nav>

      {/* OPERATIONAL STATUS FOOTER */}
      <div className="p-6">
        <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 italic">Protocol Status</p>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">XGBoost v2.4</span>
              <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Stable</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Inference</span>
              <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase">Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;