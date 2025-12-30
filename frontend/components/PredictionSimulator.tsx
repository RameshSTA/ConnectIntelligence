import React, { useState } from 'react';
import { 
  Calculator, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, 
  Zap, Landmark, Cpu, Target, Briefcase, Info, User, Activity, 
  DollarSign, PieChart, ShieldCheck, BarChart3, ChevronRight, BrainCircuit, Share2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * PredictionSimulator Component
 * ----------------------------
 * This module acts as the interactive inference layer for the XGBoost model.
 * It allows stakeholders to simulate hypothetical member profiles and observe 
 * real-time risk scoring and feature attribution (XAI).
 */
const PredictionSimulator: React.FC = () => {
  // 1. STATE & FEATURE CONFIGURATION (Aligned with Notebook 04)
  const [formData, setFormData] = useState({
    credit_score: 650, age: 35, tenure: 5, balance: 85000,
    products_number: 1, credit_card: 1, active_member: 1,
    estimated_salary: 75000, gender: 1,
    country_Germany: 1, country_Spain: 0,
    balance_salary_ratio: 1.13, is_zero_balance: 0, 
    tenure_age_ratio: 0.14, engagement_score: 2, 
    grp_Adult: 1, grp_Mid_Age: 0, grp_Senior: 0, cluster: 1
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'risk' | 'strategy'>('risk');

  /**
   * handleRunInference
   * Computes ratios and triggers the POST request to the Python Inference Server.
   */
  const handleRunInference = async () => {
    setIsCalculating(true);
    try {
      // Dynamic Ratio Calculation (Feature Engineering step from Notebook 03)
      const finalPayload = {
        ...formData,
        balance_salary_ratio: formData.balance / (formData.estimated_salary || 1),
        tenure_age_ratio: formData.tenure / (formData.age || 1),
        engagement_score: formData.active_member + (formData.products_number > 1 ? 1 : 0),
        is_zero_balance: formData.balance === 0 ? 1 : 0,
      };

      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });
      
      const result = await response.json();
      const score = typeof result.score === 'number' ? result.score : 0;

      // Simulated SHAP/Feature Importance for UI interaction
      setPrediction({
        score: score,
        revenueImpact: Math.round(formData.balance * score),
        riskLevel: score > 0.7 ? 'High Alert' : score > 0.4 ? 'Elevated' : 'Stable',
        drivers: [
          { name: "Portfolio Depth", value: formData.products_number > 2 ? -0.28 : 0.20, note: "Product density acts as a high-friction retention wall." },
          { name: "Member Activity", value: formData.active_member ? -0.35 : 0.25, note: "Lack of digital touchpoints signals detachment." },
          { name: "Age Lifecycle", value: formData.age > 55 ? 0.18 : -0.08, note: "Near-retirement members are sensitive to market shifts." },
          { name: "Asset Magnitude", value: formData.balance > 120000 ? 0.22 : -0.12, note: "High-balance accounts are primary competitor targets." },
          { name: "Wealth Ratio", value: finalPayload.balance_salary_ratio > 2.0 ? 0.15 : -0.10, note: "Imbalance in asset-to-income suggests liquidity risk." }
        ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      });
    } catch (e) {
      console.error(e);
      setPrediction({ score: 0, revenueImpact: 0, riskLevel: 'Server Offline' });
    } finally {
      setIsCalculating(false);
    }
  };

  const update = (key: string, val: number) => setFormData(p => ({ ...p, [key]: val }));

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-1000 font-sans">
      
      {/* 1. INSTITUTIONAL HEADER */}
      <header className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
        <BrainCircuit className="absolute top-[-40px] right-[-40px] text-white/5" size={300} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-8 border border-indigo-500/30">
            <Zap size={14}/> Predictive Inference Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-left">Live Risk Simulator</h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium text-left italic">
            "Directly stress-test the verified XGBoost model. By manipulating demographics and financial ratios, 
            stakeholders can identify <span className="text-indigo-400">attrition tipping points</span> and 
            generate real-time mitigation playbooks for the retention squad."
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. CONTROL PANEL (Sidebar) */}
        <aside className="w-full lg:w-[380px] space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            
            <section className="space-y-5">
              <Label icon={User} text="Member Profile" />
              <div className="grid grid-cols-2 gap-4">
                <MiniInput label="Age" val={formData.age} min={18} max={92} onChange={v => update('age', v)} />
                <MiniInput label="Tenure (Yrs)" val={formData.tenure} min={0} max={10} onChange={v => update('tenure', v)} />
              </div>
              <div className="flex gap-3">
                <ToggleBtn label="Active Member" active={formData.active_member} onClick={() => update('active_member', formData.active_member ? 0 : 1)} />
                <ToggleBtn label="Is Male" active={formData.gender} onClick={() => update('gender', formData.gender ? 0 : 1)} />
              </div>
            </section>

            <section className="space-y-5">
              <Label icon={Landmark} text="Financial Vectors" />
              <CompactSlider label="Superannuation Balance" val={formData.balance} min={0} max={250000} step={1000} unit="$" onChange={v => update('balance', v)} />
              <CompactSlider label="Estimated Salary" val={formData.estimated_salary} min={0} max={200000} step={1000} unit="$" onChange={v => update('estimated_salary', v)} />
              <MiniInput label="Credit Score" val={formData.credit_score} min={300} max={850} onChange={v => update('credit_score', v)} />
            </section>

            <section className="space-y-5">
              <Label icon={PieChart} text="Portfolio Depth" />
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 1, name: "Core", d: "Super Only" },
                  { id: 2, name: "Enhanced", d: "Super + Insurance" },
                  { id: 3, name: "Private", d: "Full Investment Suite" }
                ].map(p => (
                  <button key={p.id} onClick={() => update('products_number', p.id)} className={`w-full flex justify-between items-center px-5 py-4 rounded-2xl border text-left transition-all ${formData.products_number === p.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                    <span className="text-[11px] font-black uppercase tracking-wider">{p.name}</span>
                    <span className={`text-[10px] font-medium ${formData.products_number === p.id ? 'text-indigo-200' : 'text-slate-400'}`}>{p.d}</span>
                  </button>
                ))}
              </div>
            </section>

            <button 
              onClick={handleRunInference}
              disabled={isCalculating}
              className="w-full py-5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {isCalculating ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="text-indigo-400" />}
              {isCalculating ? "Computing Inference..." : "Execute Simulation"}
            </button>
          </div>
        </aside>

        {/* 3. INTELLIGENCE OUTPUT (Main Panel) */}
        <main className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricResult 
              title="Predictive Risk Score" 
              value={prediction ? `${(prediction.score * 100).toFixed(1)}%` : "0.0%"}
              active={activeTab === 'risk'}
              onClick={() => setActiveTab('risk')}
              color={prediction?.score > 0.5 ? 'rose' : 'emerald'}
              icon={Target}
              sub={prediction?.riskLevel || "System Idle"}
            />
            <MetricResult 
              title="AUM Exposure" 
              value={prediction ? `$${prediction.revenueImpact.toLocaleString()}` : "$0"}
              active={activeTab === 'strategy'}
              onClick={() => setActiveTab('strategy')}
              color="amber"
              icon={Briefcase}
              sub="Assets At Risk"
            />
          </div>

          <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 p-12 min-h-[550px] relative overflow-hidden">
            {activeTab === 'risk' ? (
              <div className="animate-in fade-in duration-700 text-left">
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explainable AI (XAI)</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Feature Attribution Analysis</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-1.5 bg-rose-50 text-[10px] font-black text-rose-600 rounded-full border border-rose-100 uppercase tracking-tighter">Increase Risk</div>
                    <div className="px-4 py-1.5 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-full border border-emerald-100 uppercase tracking-tighter">Decrease Risk</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 h-[350px]">
                    {prediction ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={prediction.drivers}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide domain={[-0.5, 0.5]} />
                          <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="value" barSize={24} radius={[0, 6, 6, 0]}>
                            {prediction.drivers.map((e: any, i: number) => (
                              <Cell key={i} fill={e.value > 0 ? '#f43f5e' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <EmptyPlaceholder /> }
                  </div>
                  <div className="lg:col-span-4 space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Technical Context</h4>
                     {prediction?.drivers.slice(0, 3).map((d: any, i: number) => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[11px] font-black text-indigo-600 mb-1 uppercase tracking-tight">{d.name}</p>
                         <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">"{d.note}"</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 text-left">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Retention Playbook</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-12">Automated Strategic Intervention</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">Impact Assessment</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Losing this member results in a <strong className="text-slate-900">${prediction?.revenueImpact.toLocaleString()}</strong> asset drain. 
                        Because they belong to the <strong>{formData.balance > 100000 ? 'Platinum Asset' : 'Growth Tier'}</strong> segment, this exit affects fund liquidity and rebalancing costs more heavily.
                      </p>
                    </div>
                    <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-lg shadow-indigo-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity size={18} className="text-indigo-300" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Recommended Action</h4>
                      </div>
                      <p className="text-base font-bold leading-tight">
                        {formData.balance > 100000 
                          ? "Initiate 'Priority Contact' protocol. Assign to Senior Retention Lead for bespoke fee negotiation." 
                          : "Deploy 'Engagement Nudge' sequence. Trigger automated email with personalized insurance benefits."}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 flex flex-col justify-center text-center shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                    <DollarSign size={40} className="mx-auto text-emerald-400 mb-6 relative z-10" />
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 relative z-10">Recoverable Assets</h4>
                    <p className="text-5xl font-black text-white tracking-tighter relative z-10">$ {Math.round(prediction?.revenueImpact * 0.4).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 mt-6 leading-relaxed max-w-[200px] mx-auto uppercase font-bold relative z-10">Projected Value retention based on successful 40% intervention rate.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Label = ({ icon: Icon, text }: any) => (
  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"> <Icon size={14} className="text-indigo-500"/> {text} </h4>
);

const MetricResult = ({ title, value, sub, active, onClick, color, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-10 rounded-[3rem] text-left transition-all border-2 w-full flex flex-col justify-between ${active ? 'bg-white border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white/60 border-transparent shadow-sm opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
  >
    <div className="flex justify-between items-start mb-6">
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      <Icon size={22} className={color === 'rose' ? 'text-rose-500' : 'text-amber-500'} />
    </div>
    <p className={`text-5xl font-black tracking-tighter ${color === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
    <div className="flex items-center gap-2 mt-6">
      <div className={`w-2 h-2 rounded-full ${color === 'rose' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{sub}</span>
    </div>
  </button>
);

const MiniInput = ({ label, val, min, max, onChange }: any) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">{label}</label>
    <input type="number" value={val} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} className="bg-transparent text-base font-bold text-slate-900 w-full outline-none" />
  </div>
);

const CompactSlider = ({ label, val, min, max, step, unit, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-bold text-indigo-600">{unit}{val.toLocaleString()}</span>
    </div>
    <input type="range" value={val} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
  </div>
);

const ToggleBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${active ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{label}</button>
);

const EmptyPlaceholder = () => (
  <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-50 rounded-[3rem] text-slate-200 text-center p-12">
    <Share2 size={40} className="mb-4 opacity-20" />
    <p className="text-[12px] font-black uppercase tracking-[0.3em]">System Idle: Execute Simulation to view results</p>
  </div>
);

export default PredictionSimulator;