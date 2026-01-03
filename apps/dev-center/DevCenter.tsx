
import React from 'react';
import { Layout, Cpu, Activity, Database, GitBranch, Terminal } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const DevCenter: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const projects = [
    { name: 'avryOS-Kernel', status: 'STABLE', commits: 1402, health: 98, color: 'text-emerald-500' },
    { name: 'Unity-11-DE', status: 'BETA', commits: 842, health: 85, color: 'text-blue-500' },
    { name: 'Gemini-Adapter', status: 'ACTIVE', commits: 290, health: 100, color: 'text-purple-500' },
  ];

  return (
    <div className={`h-full p-6 md:p-10 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`flex items-center justify-between mb-12 border-b pb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
        <div>
          <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Dev Center</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Active Workspace: PRODUCTION-A</p>
        </div>
        <div className="flex gap-4">
          <div className={`p-4 border text-center min-w-[80px] md:min-w-[100px] ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <div className="text-[9px] text-gray-600 uppercase mb-1">Node Status</div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">ONLINE</div>
          </div>
          <div className={`p-4 border text-center min-w-[80px] md:min-w-[100px] ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <div className="text-[9px] text-gray-600 uppercase mb-1">Latency</div>
            <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>14ms</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {projects.map(p => (
          <div key={p.name} className={`p-8 border cursor-pointer group transition-all ${isDark ? 'border-white/5 bg-white/[0.01] hover:border-red-600/30' : 'border-zinc-200 bg-white hover:border-red-600/30 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className={`text-sm font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>{p.name}</h3>
              <GitBranch size={16} className="text-gray-600" />
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className={`text-[10px] font-bold uppercase ${p.color}`}>{p.status}</div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">{p.commits} Commits</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{p.health}%</div>
                <div className="text-[8px] text-gray-700 uppercase font-bold tracking-[0.2em]">Health</div>
              </div>
            </div>
            <div className={`mt-6 h-1 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
              <div className="h-full bg-red-600" style={{ width: `${p.health}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className={`p-6 md:p-8 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">System Activity</h3>
          <div className="space-y-4">
            {[
              { label: 'CPU LOAD', val: '14%', icon: Cpu },
              { label: 'MEM LOAD', val: '26%', icon: Activity },
              { label: 'DISK I/O', val: '2MB/s', icon: Database },
            ].map(s => (
              <div key={s.label} className={`flex items-center justify-between text-xs p-4 border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <s.icon size={14} className="text-red-600" />
                  <span className="font-bold uppercase tracking-widest text-gray-400">{s.label}</span>
                </div>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 md:p-8 border flex flex-col ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Dev Logs</h3>
          <div className={`flex-1 p-4 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[160px] ${isDark ? 'bg-black text-gray-600' : 'bg-zinc-50 text-gray-500'}`}>
            <div>[10:42:01] kernel: listening on port 8080</div>
            <div>[10:42:05] auth: session started for user: admin</div>
            <div>[10:43:12] gemini: analyzing workspace...</div>
            <div>[10:44:00] system: deploy successful</div>
            <div className="text-emerald-500 animate-pulse">{">"} Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};
