
import React from 'react';
import { Megaphone, Target, MousePointer2, TrendingUp, Filter } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Campaign: React.FC = () => {
  const theme = useTheme();
  const metrics = [
    { label: 'Active Campaigns', val: '12', icon: Megaphone },
    { label: 'Total Reach', val: '1.2M', icon: Target },
    { label: 'Avg CTR', val: '4.2%', icon: MousePointer2 },
    { label: 'ROI', val: '280%', icon: TrendingUp },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`h-full p-6 md:p-10 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="flex justify-between items-center mb-12">
        <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Campaigns</h1>
        <button className={`px-6 py-2 border transition-all text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-white/5 border-white/10 hover:border-red-600 text-white' : 'bg-white border-zinc-200 hover:border-red-600 text-zinc-800 shadow-sm'}`}>
          New Acquisition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        {metrics.map(m => (
          <div key={m.label} className={`p-6 border ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <m.icon size={16} className="text-gray-500 mb-4" />
            <div className={`text-2xl font-mono mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{m.val}</div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      <div className={`border p-6 md:p-8 mb-10 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-zinc-900'}`}>Live Performance</h3>
          <Filter size={14} className="text-gray-500 cursor-pointer" />
        </div>
        <div className="space-y-6">
          {[
            { name: 'avryOS Launch', spent: '$12,400', progress: 85, color: 'bg-red-600' },
            { name: 'Developer Push', spent: '$5,200', progress: 42, color: 'bg-blue-600' },
            { name: 'Enterprise Beta', spent: '$8,900', progress: 15, color: 'bg-emerald-600' },
          ].map(c => (
            <div key={c.name} className="space-y-2">
              <div className={`flex justify-between text-[11px] font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-800'}`}>
                <span>{c.name}</span>
                <span className="text-gray-500">Spend: {c.spent}</span>
              </div>
              <div className={`h-1 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
                <div className={`h-full ${c.color}`} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
