import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Segmentation from './components/Segmentation';
import MemberExplorer from './components/MemberExplorer';
import FeatureImportance from './components/FeatureImportance';
import DataAudit from './components/DataAudit';
import MLPipeline from './components/MLPipeline';
import PredictionSimulator from './components/PredictionSimulator';
import { Member } from './types';
import { Menu, Github, Linkedin, Copyright, Share2, Cpu, RefreshCw } from 'lucide-react';

/**
 * Connect Intelligence | Enterprise Retention Engine
 * Deployment: Vercel (Frontend) & Render (Backend)
 */

const RENDER_BACKEND_URL = "https://connectintelligence.onrender.com";

const API_BASE = import.meta.env.PROD 
  ? RENDER_BACKEND_URL 
  : "http://127.0.0.1:8000";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ml-lifecycle');
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/members`);
      if (!response.ok) throw new Error("Connection failed.");
      const jsonData = await response.json();
      setData(jsonData.members || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Inference server is waking up. Please wait 30 seconds.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-6">
        <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-100 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute"></div>
        </div>
        <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">Connect Intelligence</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 overflow-hidden selection:bg-indigo-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
        isOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64 relative">
        <header className="flex-none flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"><Menu size={20} /></button>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg">
                  <Cpu size={18} className="text-indigo-400" />
               </div>
               <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Connect</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Intelligence Hub</p>
               </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">System Online</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto flex flex-col bg-[#fcfcfd]">
          <div className="flex-1 p-6 md:p-10">
            {error && (
              <div className="max-w-7xl mx-auto mb-8 p-6 bg-amber-50 border border-amber-100 text-amber-800 rounded-[2rem] flex items-center justify-between gap-4 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-4">
                  <RefreshCw size={16} className="text-amber-700 animate-spin" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
                <button onClick={fetchData} className="px-6 py-2 bg-white border border-amber-200 rounded-full text-xs font-bold hover:bg-amber-100 uppercase tracking-widest">Reconnect</button>
              </div>
            )}
            
            <div className="max-w-7xl mx-auto w-full">
              {/* Note: EDA Dashboard removed for a more focused ML-first experience */}
              {activeTab === 'ml-lifecycle' && <MLPipeline onLaunchPredictor={() => setActiveTab('simulator')} />}
              {activeTab === 'simulator' && <PredictionSimulator />}
              {activeTab === 'segmentation' && <Segmentation data={data} />}
              {activeTab === 'members' && <MemberExplorer data={data} />}
              {activeTab === 'insights' && <FeatureImportance />}
              {activeTab === 'data-quality' && <DataAudit data={data} />}
            </div>
          </div>

          <footer className="mt-auto py-20 px-10 border-t border-slate-100 bg-white">
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-10">
              <div className="space-y-2">
                 <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">Ramesh Shrestha</h3>
                 <p className="text-sm text-slate-500 font-medium italic">Data Scientist & Machine Learning Engineer</p>
              </div>

              <div className="flex items-center gap-12">
                <a href="https://github.com/RameshSTA" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="p-4 bg-slate-50 rounded-3xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <Github size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Github</span>
                </a>
                <div className="w-px h-10 bg-slate-100" />
                <a href="https://www.linkedin.com/in/rameshsta/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                  <div className="p-4 bg-slate-50 rounded-3xl text-slate-400 group-hover:bg-[#0A66C2] group-hover:text-white transition-all duration-300">
                    <Linkedin size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Linkedin</span>
                </a>
              </div>

              <div className="flex flex-col items-center gap-4 pt-10 border-t border-slate-50 w-full max-w-xs">
                 <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <Share2 size={18} className="text-indigo-600" />
                    <span>Connect Intelligence</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                    <Copyright size={11} />
                    <span>{new Date().getFullYear()} all rights reserved</span>
                 </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;