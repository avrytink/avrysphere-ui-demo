
import React from 'react';
import { Globe, Shield, Zap, Layout, Monitor, ArrowUpRight, Plus, MoreHorizontal } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const WebStudio: React.FC = () => {
  const { theme } = useOSStore();
  const isDark = theme === 'dark';

  const sites = [
    { name: 'avryos.io', status: 'Healthy', traffic: '1.2M', uptime: '99.9%' },
    { name: 'unity11.net', status: 'Healthy', traffic: '402K', uptime: '100%' },
    { name: 'gemini-adapter.dev', status: 'Healthy', traffic: '12K', uptime: '99.8%' },
  ];

  return (
    <div className={`h-full p-6 md:p-10 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`flex items-center justify-between mb-12 border-b pb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
        <div>
          <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Web Studio</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Domain & Hosting Controller</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white">
          <Plus size={14} /> <span className="hidden md:inline">New Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {sites.map(s => (
          <div key={s.name} className={`relative group border overflow-hidden ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <div className={`aspect-video flex items-center justify-center p-8 group-hover:bg-blue-600/10 transition-colors ${isDark ? 'bg-gray-900/50' : 'bg-zinc-100'}`}>
              <Monitor size={48} className={`transition-colors ${isDark ? 'text-gray-800 group-hover:text-blue-500' : 'text-zinc-300 group-hover:text-blue-500'}`} />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>{s.name}</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-100 bg-zinc-50'}`}>
                   <div className="text-[8px] text-gray-600 uppercase mb-1">Traffic</div>
                   <div className={`text-xs font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{s.traffic}</div>
                </div>
                <div className={`p-3 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-100 bg-zinc-50'}`}>
                   <div className="text-[8px] text-gray-600 uppercase mb-1">Uptime</div>
                   <div className={`text-xs font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{s.uptime}</div>
                </div>
              </div>
              <button className="w-full py-2 border border-blue-600/30 text-blue-500 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                Manage Deployment
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 md:p-8 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Edge Network Health</h3>
          <div className="space-y-6">
            {[
              { region: 'US-WEST', latency: '12ms', load: 14 },
              { region: 'EU-CENTRAL', latency: '42ms', load: 82 },
              { region: 'ASIA-NORTHEAST', latency: '110ms', load: 31 },
            ].map(r => (
              <div key={r.region} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase">
                   <span className={isDark ? 'text-white' : 'text-zinc-900'}>{r.region}</span>
                   <span className="text-gray-600">{r.latency}</span>
                 </div>
                 <div className={`h-1 ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
                   <div className={`h-full ${r.load > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${r.load}%` }} />
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 md:p-8 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Security Intelligence</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-600/5 border border-emerald-600/20 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Shield size={18} className="text-emerald-500" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>TLS certificates are current</span>
               </div>
               <ArrowUpRight size={14} className="text-gray-600" />
            </div>
            <div className="p-4 bg-blue-600/5 border border-blue-600/20 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Zap size={18} className="text-blue-500" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>WAF Active (Rule V3)</span>
               </div>
               <ArrowUpRight size={14} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
