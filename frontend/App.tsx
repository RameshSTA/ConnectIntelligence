import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Segmentation from './components/Segmentation';
import MemberExplorer from './components/MemberExplorer';
import FeatureImportance from './components/FeatureImportance';
import DataAudit from './components/DataAudit';
import MLPipeline from './components/MLPipeline';
import PredictionSimulator from './components/PredictionSimulator';
import { Member } from './types';
import { Menu, Github, Linkedin, Copyright, Share2, Cpu } from 'lucide-react';

/**
 * Connect Intelligence | Enterprise Dashboard
 * Deployment: Vercel (Frontend) & Render (Backend)
 */

// CHANGE THIS: Replace with your actual Render URL after deploying backend
const RENDER_BACKEND_URL = "https://your-app-name.onrender.com";

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
    try {
      const response = await fetch(`${API_BASE}/api/members`);
      if (!response.ok) throw new Error("Connection failed.");
      const jsonData = await response.json();
      setData(jsonData.members || []);
      setError(null);
    } catch (err) {
      setError("Inference server offline. Check Render deployment.");
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
        <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Connecting Intelligence...</p>
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
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-600"><Menu size={20} /></button>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-900 rounded-xl">
                  <Cpu size={18} className="text-indigo-400" />
               </div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Connect</h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">System Active</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto flex flex-col bg-[#fcfcfd]">
          <div className="flex-1 p-6 md:p-10">
            {error && (
              <div className="max-w-7xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold">
                {error}
              </div>
            )}
            <div className="max-w-7xl mx-auto w-full">
              {activeTab === 'ml-lifecycle' && <MLPipeline onLaunchPredictor={() => setActiveTab('simulator')} />}
              {activeTab === 'simulator' && <PredictionSimulator />}
              {activeTab === 'segmentation' && <Segmentation data={data} />}
              {activeTab === 'members' && <MemberExplorer data={data} />}
              {activeTab === 'insights' && <FeatureImportance />}
              {activeTab === 'data-quality' && <DataAudit data={data} />}
            </div>
          </div>

          <footer className="mt-auto py-16 px-10 border-t border-slate-100 bg-white">
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
              <div className="space-y-1">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ramesh Shrestha</h3>
                 <p className="text-sm text-slate-500 font-medium">Data Scientist & Machine Learning Engineer</p>
              </div>

              <div className="flex items-center gap-10">
                <a href="https://github.com/RameshSTA" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors"><Github size={22} /></a>
                <div className="w-px h-6 bg-slate-200" />
                <a href="https://www.linkedin.com/in/rameshsta/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0A66C2] transition-colors"><Linkedin size={22} /></a>
              </div>

              <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-50 w-full">
                 <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <Share2 size={14} className="text-indigo-600" />
                    <span>Connect Intelligence</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Copyright size={10} />
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