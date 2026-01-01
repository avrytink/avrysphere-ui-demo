
import React, { useMemo } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { Cpu, Activity, Zap, XCircle } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const ProcessManager: React.FC = () => {
  const { theme } = useOSStore();
  const { windows, closeWindow, focusWindow } = useWindowStore();

  const isDark = theme === 'dark';

  const activeProcesses = useMemo(() => 
    windows.filter(w => w.isOpen),
    [windows]
  );

  return (
    <div className={`h-full flex flex-col text-xs font-sans ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`p-6 md:p-10 border-b ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>System Monitor</h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">Active Modalities: {activeProcesses.length}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className={`flex-1 md:flex-none p-4 border rounded-2xl flex flex-col items-center min-w-[100px] md:min-w-[120px] ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <Cpu size={16} className="text-blue-600 mb-2" />
              <div className={`text-xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>14.2%</div>
              <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">CPU Load</div>
            </div>
            <div className={`flex-1 md:flex-none p-4 border rounded-2xl flex flex-col items-center min-w-[100px] md:min-w-[120px] ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <Activity size={16} className="text-emerald-600 mb-2" />
              <div className={`text-xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>8.4GB</div>
              <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">RAM Commit</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className={`text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
              <tr>
                <th className="pb-4 font-bold">Process Identity</th>
                <th className="pb-4 font-bold text-center">PID</th>
                <th className="pb-4 font-bold text-center">Status</th>
                <th className="pb-4 font-bold text-center">Priority</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-black uppercase tracking-widest">
              {activeProcesses.map((proc) => {
                const app = APP_REGISTRY[proc.appId];
                return (
                  <tr key={proc.instanceId} className={`border-b transition-colors group ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-zinc-100 hover:bg-white shadow-sm'}`}>
                    <td className="py-6 flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                        <app.icon size={16} className={`transition-colors ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-black'}`} />
                      </div>
                      <div>
                        <div className={`transition-colors ${isDark ? 'text-white group-hover:text-blue-500' : 'text-zinc-900 group-hover:text-blue-600'}`}>{app.title}</div>
                        <div className="text-[8px] text-zinc-700 mt-1">{proc.instanceId}</div>
                      </div>
                    </td>
                    <td className="py-6 font-mono text-center text-zinc-500">{proc.instanceId.slice(0, 5)}</td>
                    <td className="py-6 text-center">
                      <span className="px-2 py-0.5 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 rounded-md">
                        Running
                      </span>
                    </td>
                    <td className="py-6 text-center text-zinc-500">Normal</td>
                    <td className="py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => focusWindow(proc.instanceId)}
                          className={`px-3 py-1.5 rounded-lg transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'}`}
                        >
                          Inspect
                        </button>
                        <button 
                          onClick={() => closeWindow(proc.instanceId)}
                          className="p-1.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {activeProcesses.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Zap size={48} className="mx-auto text-zinc-900" />
            <div className="text-sm font-black text-zinc-800 uppercase tracking-[0.5em]">No Active Modalities Found</div>
          </div>
        )}
      </div>
    </div>
  );
};
