
import React from 'react';
import { Cpu, Activity, HardDrive, Zap, Info } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Feeling: React.FC = () => {
  const { theme } = useOSStore();
  const vitals = [
    { label: 'CPU Usage', value: '14.2%', color: 'bg-emerald-500', icon: Cpu },
    { label: 'Memory', value: '8.4 GB / 32 GB', color: 'bg-blue-500', icon: Activity },
    { label: 'Storage', value: '256 GB / 1 TB', color: 'bg-amber-500', icon: HardDrive },
    { label: 'Power', value: '42.0 W', color: 'bg-red-500', icon: Zap },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`h-full p-6 md:p-8 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`flex items-center justify-between mb-10 border-b pb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
        <div>
          <h1 className={`text-3xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>System Vitals</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Kernel Version 6.5.0 Stable</p>
        </div>
        <Info size={20} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {vitals.map(v => (
          <div key={v.label} className={`p-8 border transition-all ${isDark ? 'border-white/10 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-zinc-200 bg-white shadow-sm hover:shadow-md'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-100'}`}>
                  <v.icon size={18} className={isDark ? 'text-white/80' : 'text-zinc-600'} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{v.label}</span>
              </div>
              <span className={`text-xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{v.value}</span>
            </div>
            <div className={`h-1 w-full ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
              <div className={`h-full ${v.color}`} style={{ width: v.label === 'CPU Usage' ? '14.2%' : v.label === 'Memory' ? '26%' : v.label === 'Storage' ? '25%' : '42%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className={`p-6 md:p-10 border ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-8">Hardware Load Telemetry</h3>
        <div className="h-32 flex items-end gap-1 px-2">
          {Array.from({ length: 80 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-red-600/40 hover:bg-red-500 transition-colors" 
              style={{ height: `${Math.sin(i * 0.2) * 30 + 50 + Math.random() * 20}%` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
