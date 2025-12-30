import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  ShieldCheck, Target, Activity, Loader2, Info, AlertTriangle, 
  ChevronRight, BrainCircuit, BarChart3, TrendingUp, Zap, HelpCircle 
} from 'lucide-react';

const ModelEvaluation: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/model-insights')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); });
  }, []);

  const metricDetails: any = {
    "Accuracy": {
      meaning: "The total percentage of correct predictions (both stayers and churners) out of the entire member base.",
      business: "Accuracy acts as the model's 'General Trust Score'. High accuracy ensures that fund-wide reporting and AUM projections are statistically reliable.",
      formula: "(TP + TN) / Total"
    },
    "Recall (Churn)": {
      meaning: "The ability of the model to find ALL actual churners. Also known as 'Sensitivity'.",
      business: "This is our most critical metric. Higher Recall prevents 'Revenue Leakage' by ensuring no member planning to exit goes undetected by our retention teams.",
      formula: "TP / (TP + FN)"
    },
    "Precision": {
      meaning: "The probability that a predicted churner is actually going to leave.",
      business: "Precision optimizes Marketing ROI. High precision ensures that retention staff aren't wasting hours calling members who were perfectly happy with the fund.",
      formula: "TP / (TP + FP)"
    },
    "F1-Score": {
      meaning: "The harmonic mean of Precision and Recall.",
      business: "F1 is used to balance the trade-off between missing churners (Recall) and annoying happy members (Precision). It represents the stable operational efficiency of the model.",
      formula: "2 * (P * R) / (P + R)"
    },
    "True Negative": {
      meaning: "Correctly identified members who intend to stay.",
      business: "Confirms the 'Stable Base'. These members require standard automated nurture campaigns rather than expensive manual intervention.",
      impact: "Preserves operational bandwidth."
    },
    "False Positive": {
      meaning: "Members predicted to leave who are actually staying.",
      business: "Known as a 'False Alarm'. While safe, high FP rates lead to unnecessary retention discounts being offered to members who would have stayed anyway.",
      impact: "Increased cost of retention."
    },
    "False Negative": {
      meaning: "Members predicted to stay who are actually leaving.",
      business: "This is the most dangerous error. These are 'Silent Exits' where the fund loses AUM without any opportunity to intervene.",
      impact: "Direct loss of Assets Under Management."
    },
    "True Positive": {
      meaning: "Correctly identified members at high risk of exit.",
      business: "Direct ROI opportunities. These are the members our specialized retention squads must contact immediately to negotiate fees or insurance.",
      impact: "Direct AUM preservation."
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40}/>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditing Model Weights...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      {/* 1. INSTITUTIONAL INTRODUCTION */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl">
        <BrainCircuit className="absolute top-[-20px] right-[-20px] text-white/5" size={250} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/30">
            <ShieldCheck size={14}/> Algorithmic Governance
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4">Model Evaluation & Audit</h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            A transparent breakdown of the XGBoost classifier's performance. We move beyond raw accuracy to measure 
            <span className="text-indigo-400"> Discriminatory Power</span> and <span className="text-emerald-400">Risk Sensitivity</span>, 
            ensuring our automated interventions are both precise and profitable.
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Accuracy", val: "84%", color: "indigo", sub: "Global Precision" },
          { label: "Recall (Churn)", val: "63%", color: "emerald", sub: "Risk Sensitivity" },
          { label: "Precision", val: "59%", color: "amber", sub: "ROI Efficiency" },
          { label: "F1-Score", val: "0.61", color: "rose", sub: "Operational Balance" }
        ].map((m) => (
          <button 
            key={m.label}
            onClick={() => setActiveMetric({ ...m, ...metricDetails[m.label] })}
            className={`group text-left transition-all duration-300 transform hover:-translate-y-2 ${activeMetric?.label === m.label ? 'ring-4 ring-indigo-500/20' : ''}`}
          >
            <MetricCard {...m} isActive={activeMetric?.label === m.label} />
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC INTELLIGENCE PANEL (Deep Dive) */}
      {activeMetric && (
        <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-10 shadow-xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500" />
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Technical Definition</p>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{activeMetric.label}</h4>
              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-emerald-400 text-sm mb-4">
                {activeMetric.formula || "Impact Analysis"}
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                "{activeMetric.meaning}"
              </p>
            </div>
            <div className="lg:w-2/3 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-center gap-8">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Target size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Strategy & Impact</p>
                <p className="text-slate-700 font-bold leading-relaxed">
                  {activeMetric.business || activeMetric.impact}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. VISUAL CONFUSION MATRIX */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-10 flex justify-between items-end">
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Confusion Matrix</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Classification Fidelity Audit</p>
             </div>
             <HelpCircle className="text-slate-300" size={24} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
             <CMTile 
                label="True Negative" val={data.confusion_matrix.tn} sub="Correct Stay" color="emerald" 
                onClick={() => setActiveMetric({ label: "True Negative", ...metricDetails["True Negative"] })}
             />
             <CMTile 
                label="False Positive" val={data.confusion_matrix.fp} sub="False Alarm" color="amber" 
                onClick={() => setActiveMetric({ label: "False Positive", ...metricDetails["False Positive"] })}
             />
             <CMTile 
                label="False Negative" val={data.confusion_matrix.fn} sub="Missed Risk" color="rose" 
                onClick={() => setActiveMetric({ label: "False Negative", ...metricDetails["False Negative"] })}
             />
             <CMTile 
                label="True Positive" val={data.confusion_matrix.tp} sub="Correct Churn" color="indigo" 
                onClick={() => setActiveMetric({ label: "True Positive", ...metricDetails["True Positive"] })}
             />
          </div>
        </div>

        {/* 5. ROC-AUC PERFORMANCE CURVE */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">ROC Performance</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Area Under Curve Analysis</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Probability AUC</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none mt-1">0.84</p>
             </div>
          </div>

          <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.roc_curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="rocFill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="fpr" hide />
                 <YAxis hide />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                 />
                 <Line type="monotone" dataKey={(d) => d.fpr} stroke="#cbd5e1" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                 <Area type="monotone" dataKey="tpr" stroke="#6366f1" strokeWidth={5} fill="url(#rocFill)" animationDuration={2000} />
               </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="mt-10 p-5 bg-indigo-50/50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-indigo-600" size={20}/>
              <span className="text-[11px] font-bold text-slate-700">Discriminatory power is significantly above the baseline (0.50).</span>
            </div>
            <ChevronRight className="text-indigo-300" size={16}/>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- REDESIGNED HELPER COMPONENTS ---

const MetricCard = ({ label, val, sub, color, isActive }: any) => {
  const themes: any = {
    indigo: 'border-indigo-100 bg-white group-hover:border-indigo-400 group-hover:bg-indigo-50/30',
    emerald: 'border-emerald-100 bg-white group-hover:border-emerald-400 group-hover:bg-emerald-50/30',
    amber: 'border-amber-100 bg-white group-hover:border-amber-400 group-hover:bg-amber-50/30',
    rose: 'border-rose-100 bg-white group-hover:border-rose-400 group-hover:bg-rose-50/30'
  };
  const textColors: any = { indigo: 'text-indigo-600', emerald: 'text-emerald-600', amber: 'text-amber-600', rose: 'text-rose-600' };

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 shadow-sm h-full flex flex-col justify-between ${themes[color]}`}>
       <div>
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <p className={`text-4xl font-black tracking-tighter ${textColors[color]}`}>{val}</p>
       </div>
       <div className="mt-4 flex items-center justify-between">
         <p className="text-[9px] font-bold text-slate-400 uppercase">{sub}</p>
         <Zap size={14} className={isActive ? textColors[color] : 'text-slate-200'} />
       </div>
    </div>
  );
};

const CMTile = ({ label, val, sub, color, onClick }: any) => {
  const themes: any = { 
    emerald: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 hover:bg-emerald-50', 
    rose: 'bg-rose-50/50 text-rose-600 border-rose-100 hover:bg-rose-50', 
    indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:bg-indigo-50',
    amber: 'bg-amber-50/50 text-amber-600 border-amber-100 hover:bg-amber-50'
  };
  return (
    <div 
      onClick={onClick}
      className={`p-10 rounded-[2.5rem] border text-center flex flex-col justify-center cursor-pointer transition-all hover:scale-105 ${themes[color]}`}
    >
       <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">{label}</p>
       <p className="text-5xl font-black tracking-tighter mb-2">{val}</p>
       <div className="flex items-center justify-center gap-1.5 opacity-60">
          <p className="text-[9px] font-black uppercase">{sub}</p>
          <ChevronRight size={10} />
       </div>
    </div>
  );
};

export default ModelEvaluation;