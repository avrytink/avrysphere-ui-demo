
import React from 'react';
import { TrendingUp, Users, Clock, Globe } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Analytics: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  // Styles
  const bgMain = isDark ? 'bg-black' : 'bg-slate-50';
  const headerBorder = isDark ? 'border-white/10' : 'border-zinc-200';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const btnSecondary = isDark ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600';
  const cardBg = isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-zinc-200 bg-white shadow-sm hover:shadow-md';
  const graphBar = isDark ? 'bg-white/5' : 'bg-zinc-100';

  const stats = [
    { label: 'Total Users', value: '42,901', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Avg Session', value: '4m 32s', change: '+5%', icon: Clock, color: 'text-emerald-500' },
    { label: 'Retention', value: '64.2%', change: '-2%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Global Reach', value: '182', change: '+1', icon: Globe, color: 'text-orange-500' },
  ];

  return (
    <div className={`h-full p-6 md:p-8 overflow-y-auto ${bgMain}`}>
      <div className={`flex justify-between items-center mb-10 pb-6 border-b ${headerBorder}`}>
        <h1 className={`text-2xl md:text-3xl font-light uppercase tracking-tighter ${textPrimary}`}>OS Analytics</h1>
        <div className="flex gap-2">
          <button className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest ${btnSecondary}`}>Week</button>
          <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-600/20">Month</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        {stats.map(s => (
          <div key={s.label} className={`p-6 border transition-colors ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <s.icon size={18} className={s.color} />
              <span className={`text-[10px] font-bold ${s.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</span>
            </div>
            <div className={`text-2xl font-mono mb-1 ${textPrimary}`}>{s.value}</div>
            <div className={`text-[10px] uppercase font-bold tracking-widest ${textSecondary}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 border h-64 flex flex-col ${cardBg}`}>
          <span className={`text-[10px] uppercase font-bold mb-6 ${textSecondary}`}>User Acquisition</span>
          <div className="flex-1 flex items-end gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex-1 bg-red-600/40 hover:bg-red-600 transition-all cursor-crosshair" style={{ height: `${Math.random() * 80 + 20}%` }} />
            ))}
          </div>
        </div>
        <div className={`p-6 border h-64 ${cardBg}`}>
           <span className={`text-[10px] uppercase font-bold mb-6 ${textSecondary}`}>Top Regions</span>
           <div className="space-y-4 mt-4">
              {['North America', 'Europe', 'Asia Pacific', 'Latin America'].map((region, i) => (
                <div key={region} className="space-y-1">
                   <div className={`flex justify-between text-[10px] uppercase font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                     <span>{region}</span><span>{90 - (i*15)}%</span>
                   </div>
                   <div className={`h-1 ${graphBar}`}>
                     <div className="h-full bg-blue-500" style={{ width: `${90 - (i*15)}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
