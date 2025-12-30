import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, Info, Layers, Loader2 } from 'lucide-react';

// Using string-based segments from the backend
const SEGMENT_COLORS: Record<string, string> = {
  "High Value At Risk": "#f43f5e",
  "Disengaged Youth": "#f59e0b",
  "Pre-Retirees": "#6366f1",
  "Wealth Builders": "#10b981",
  "Stable Savers": "#94a3b8",
  "General Portfolio": "#cbd5e1"
};

const Segmentation: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/segmentation')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Segmentation Fetch Error:", err));
  }, []);

  const filteredData = selectedSegment === 'All' ? data : data.filter(d => d.segment === selectedSegment);

  const getAvg = (seg: string, field: string) => {
    const targetData = seg === 'All' ? data : data.filter(d => d.segment === seg);
    const sum = targetData.reduce((acc, curr) => acc + (curr[field] as number), 0);
    return targetData.length ? (sum / targetData.length).toFixed(1) : '0';
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Running t-SNE Manifold Projection...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Methodology Banner */}
      <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 mb-3">
            <Layers className="text-indigo-400" size={28}/> Unsupervised Cluster Analysis
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl italic font-medium">
            "We applied <strong>K-Means Clustering</strong> to segment the portfolio. Dimensionality reduction via <strong>PCA (Principal Component Analysis)</strong> allows us to project 19-dimensional member behaviors onto this 2D manifold for visual pattern discovery."
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart Area */}
        <div className="flex-1 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Feature Space Projection</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Member Distribution by Latent Behavior</p>
            </div>
            <select 
              className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none cursor-pointer"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
            >
                <option value="All">All Clusters</option>
                {Object.keys(SEGMENT_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis type="number" dataKey="pcaX" hide />
                <YAxis type="number" dataKey="pcaY" hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-6 border border-slate-100 shadow-2xl rounded-2xl min-w-[200px] animate-in zoom-in-95 duration-200">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-3">{d.segment}</p>
                          <div className="space-y-2">
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-500 uppercase">Balance</span> <span className="text-xs font-black">${d.superBalance.toLocaleString()}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-bold text-slate-500 uppercase">Churn</span> <span className="text-xs font-black text-rose-500">{(d.churnProbability * 100).toFixed(1)}%</span></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={filteredData}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.segment]} fillOpacity={0.6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <h4 className="font-black text-slate-900 text-xl tracking-tighter">Cluster Statistics</h4>
            
            <div className="space-y-3">
              <SidebarItem label="Avg Balance" val={`$${Number(getAvg(selectedSegment, 'superBalance')).toLocaleString()}`} />
              <SidebarItem label="Avg Age" val={`${getAvg(selectedSegment, 'age')} Yrs`} />
              <SidebarItem label="Engagement" val={`${getAvg(selectedSegment, 'appSessionsPerMonth')} Score`} />
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Risk Level</span>
                 <span className={`text-xs font-black uppercase ${Number(getAvg(selectedSegment, 'churnProbability')) > 0.3 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {Number(getAvg(selectedSegment, 'churnProbability')) > 0.3 ? 'Elevated' : 'Stable'}
                 </span>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                 <Info size={18} />
                 <h5 className="text-[10px] font-black uppercase tracking-widest">ML Strategy</h5>
              </div>
              <p className="text-[11px] text-indigo-900 leading-relaxed font-semibold italic">
                {selectedSegment === "High Value At Risk" && "🚨 Immediate Outbound Concierge: Member shows high balance and elevated churn signals. Manual intervention required."}
                {selectedSegment === "Disengaged Youth" && "📱 Mobile Gamification: Low balance, low activity. Target via push notifications with education content."}
                {selectedSegment === "Pre-Retirees" && "💼 Capital Preservation: High age, mid balance. Promote retirement calculators and safety-first portfolios."}
                {selectedSegment === "All" && "Select a behavioral cluster to reveal the specific AI-recommended retention strategy."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ label, val }: any) => (
  <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-slate-900 tracking-tight">{val}</p>
  </div>
);

export default Segmentation;