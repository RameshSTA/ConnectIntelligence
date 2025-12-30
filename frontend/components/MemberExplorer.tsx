import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, User, ShieldAlert, Filter, ArrowUpDown, X, ExternalLink } from 'lucide-react';

const MemberLedger: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/member-ledger')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return data.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search)).slice(0, 100);
  }, [data, search]);

  if (loading) return <div className="p-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">Initialising Ledger...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm animate-in fade-in duration-500 font-sans">
      
      {/* TOOLBAR */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" placeholder="Search by ID or Name..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded text-[12px] outline-none focus:border-indigo-500 transition-all"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50"><Filter size={12}/> Filter</button>
          <span className="text-[11px] text-slate-400 font-medium">Displaying {filtered.length} of {data.length} records</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEDGER TABLE (PRIMARY VIEW) */}
        <div className={`flex-1 overflow-y-auto ${selected ? 'hidden lg:block' : 'block'}`}>
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-200 shadow-sm">
              <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Risk Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr 
                  key={m.id} 
                  onClick={() => setSelected(m)}
                  className={`cursor-pointer transition-colors ${selected?.id === m.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}
                >
                  <td className="px-6 py-4 text-[12px] font-mono text-slate-500">{m.id}</td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-slate-800">{m.name}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-500 font-medium">{m.country}</td>
                  <td className="px-6 py-4 text-[12px] font-bold text-slate-700">${m.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[12px] text-slate-500">{m.products}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${m.churn === 1 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {m.churn === 1 ? 'High Risk' : 'Stable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right"><ChevronRight size={14} className="text-slate-300 inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IN-DETAIL PANEL (CLICK-THROUGH VIEW) */}
        {selected && (
          <div className="w-full lg:w-[450px] bg-slate-50 border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">In-Details Profile</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={16}/></button>
            </div>

            <div className="p-8 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xl">{selected.name[0]}</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                  <p className="text-[11px] font-medium text-indigo-500 uppercase tracking-widest">{selected.cluster}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Estimated Salary" val={`$${selected.salary.toLocaleString()}`} />
                <DetailItem label="Credit Score" val={selected.age} />
                <DetailItem label="Account Tenure" val={`${selected.tenure} Years`} />
                <DetailItem label="Engagement" val={`${selected.engagement} Score`} />
              </div>

              {/* Status Section */}
              <section className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Status</h4>
                <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
                   <StatusRow label="Credit Card Provided" status={selected.credit_card} />
                   <StatusRow label="Active Member Status" status={selected.active} />
                   <StatusRow label="Identity Verified" status="Yes" />
                </div>
              </section>

              {/* Business Strategy Callout */}
              <div className="bg-indigo-600 p-6 rounded text-white shadow-md relative overflow-hidden">
                <ExternalLink className="absolute bottom-[-10px] right-[-10px] text-white/10" size={100} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-indigo-200">Retention Strategy</h4>
                <p className="text-sm font-medium leading-relaxed italic">
                  "{selected.churn === 1 
                    ? `Member exhibits high exit probability due to low engagement. Recommended outbound retention contact within 48 hours.`
                    : `Member is currently stable. Maintain regular nurture cycle through regional marketing channels.`}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MICRO-COMPONENTS ---

const DetailItem = ({ label, val }: any) => (
  <div className="bg-white p-4 border border-slate-200 rounded">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-[14px] font-bold text-slate-800 tracking-tight">{val}</p>
  </div>
);

const StatusRow = ({ label, status }: any) => (
  <div className="flex justify-between items-center text-[12px]">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className={`font-bold ${status === 'Yes' ? 'text-emerald-500' : 'text-slate-400'}`}>{status}</span>
  </div>
);

export default MemberLedger;