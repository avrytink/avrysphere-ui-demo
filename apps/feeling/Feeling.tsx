
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, Activity, HardDrive, Zap, Info, Search, X, 
  LayoutGrid, BarChart3, Users, Clock, Settings, 
  ChevronRight, MoreHorizontal, Square, RefreshCw
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';
import { useWindowStore } from '../../store/windowStore';
import { useAuthStore } from '../../store/authStore';
import { APP_REGISTRY } from '../../registry/AppRegistry';

type Tab = 'processes' | 'performance' | 'users' | 'details' | 'services';

export const Feeling: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const { windows, closeWindow, focusWindow } = useWindowStore();
  const { currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('processes');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [vitals, setVitals] = useState({ cpu: 12, memory: 8.4, disk: 2, network: 0.5 });
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 20 + 10));
  const [memHistory, setMemHistory] = useState<number[]>(Array(60).fill(0).map(() => Math.random() * 5 + 30));

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        const newCpu = Math.max(2, Math.min(99, prev.cpu + (Math.random() - 0.5) * 5));
        const newMem = Math.max(4, Math.min(32, prev.memory + (Math.random() - 0.5) * 0.2));
        
        setCpuHistory(h => [...h.slice(1), newCpu]);
        setMemHistory(h => [...h.slice(1), (newMem / 32) * 100]);

        return {
          cpu: newCpu,
          memory: newMem,
          disk: Math.random() * 5,
          network: Math.random() * 2
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const activeProcesses = useMemo(() => {
    const procs = windows.filter(w => w.isOpen).map(w => {
      const app = APP_REGISTRY[w.appId];
      return {
        id: w.instanceId,
        name: app?.title || 'Unknown Process',
        icon: app?.icon || Activity,
        cpu: (Math.random() * 5).toFixed(1),
        memory: (Math.random() * 400 + 50).toFixed(1),
        status: 'Running',
        appId: w.appId
      };
    });

    if (searchQuery) {
      return procs.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return procs;
  }, [windows, searchQuery]);

  const handleEndTask = () => {
    if (selectedProcessId) {
      closeWindow(selectedProcessId);
      setSelectedProcessId(null);
    }
  };

  const sidebarItems = [
    { id: 'processes', label: 'Processes', icon: LayoutGrid },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'details', label: 'Details', icon: Clock },
    { id: 'services', label: 'Services', icon: Settings },
  ];

  const renderProcesses = () => (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`flex items-center gap-4 p-4 border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
        <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md ${isDark ? 'bg-white/5' : 'bg-zinc-100'}`}>
          <Search size={14} className="text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search processes" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full"
          />
        </div>
        <button 
          onClick={handleEndTask}
          disabled={!selectedProcessId}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            !selectedProcessId 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          } ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'}`}
        >
          End task
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className={`sticky top-0 z-10 text-[11px] font-medium ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-50 text-zinc-500'}`}>
            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
              <th className="p-3 pl-6 font-normal">Name</th>
              <th className="p-3 font-normal text-right w-24">CPU</th>
              <th className="p-3 font-normal text-right w-24">Memory</th>
              <th className="p-3 font-normal text-right w-24">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {activeProcesses.map(proc => (
              <tr 
                key={proc.id} 
                onClick={() => setSelectedProcessId(proc.id)}
                onDoubleClick={() => focusWindow(proc.id)}
                className={`group cursor-default border-b transition-colors ${
                  selectedProcessId === proc.id
                    ? (isDark ? 'bg-blue-600/20 text-white' : 'bg-blue-50 text-blue-700')
                    : (isDark ? 'border-white/5 hover:bg-white/5 text-zinc-300' : 'border-zinc-100 hover:bg-zinc-50 text-zinc-700')
                }`}
              >
                <td className="p-2 pl-6 flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${isDark ? 'bg-white/5' : 'bg-white shadow-sm border border-zinc-100'}`}>
                    <proc.icon size={14} />
                  </div>
                  <span className="truncate">{proc.name}</span>
                </td>
                <td className="p-2 text-right font-mono text-zinc-500">{proc.cpu}%</td>
                <td className="p-2 text-right font-mono text-zinc-500">{proc.memory} MB</td>
                <td className="p-2 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                    {proc.status}
                  </span>
                </td>
              </tr>
            ))}
            {activeProcesses.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-zinc-500 italic">
                  No active processes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const [perfTab, setPerfTab] = useState<'CPU' | 'Memory' | 'Disk' | 'Ethernet'>('CPU');

  const renderPerformance = () => {
    const perfItems = [
      { label: 'CPU', value: `${vitals.cpu.toFixed(1)}%`, icon: Cpu, color: 'text-blue-500', stroke: '#3b82f6', history: cpuHistory, details: [
        { label: 'Utilization', value: `${vitals.cpu.toFixed(1)}%` },
        { label: 'Speed', value: '4.21 GHz' },
        { label: 'Processes', value: activeProcesses.length },
        { label: 'Threads', value: '2431' },
        { label: 'Handles', value: '98,241' },
        { label: 'Up time', value: '0:14:22:45' },
      ]},
      { label: 'Memory', value: `${vitals.memory.toFixed(1)}/32 GB`, icon: Activity, color: 'text-purple-500', stroke: '#a855f7', history: memHistory, details: [
        { label: 'In use', value: `${vitals.memory.toFixed(1)} GB` },
        { label: 'Available', value: `${(32 - vitals.memory).toFixed(1)} GB` },
        { label: 'Committed', value: `${(vitals.memory + 2).toFixed(1)}/38 GB` },
        { label: 'Cached', value: '4.2 GB' },
        { label: 'Paged pool', value: '640 MB' },
        { label: 'Non-paged pool', value: '1.2 GB' },
      ]},
      { label: 'Disk 0 (C:)', value: `${vitals.disk.toFixed(0)}%`, icon: HardDrive, color: 'text-emerald-500', stroke: '#10b981', history: Array(60).fill(0).map(() => Math.random() * 20), details: [
        { label: 'Active time', value: `${vitals.disk.toFixed(1)}%` },
        { label: 'Average response time', value: '0.1 ms' },
        { label: 'Read speed', value: '12.4 KB/s' },
        { label: 'Write speed', value: '45.8 KB/s' },
        { label: 'Capacity', value: '954 GB' },
        { label: 'Formatted', value: '954 GB' },
      ]},
      { label: 'Ethernet', value: `${vitals.network.toFixed(1)} Kbps`, icon: Zap, color: 'text-amber-500', stroke: '#f59e0b', history: Array(60).fill(0).map(() => Math.random() * 10), details: [
        { label: 'Send', value: `${vitals.network.toFixed(1)} Kbps` },
        { label: 'Receive', value: `${(vitals.network * 2.5).toFixed(1)} Kbps` },
        { label: 'Adapter name', value: 'Intel(R) Ethernet Connection' },
        { label: 'IPv4 address', value: '192.168.1.128' },
        { label: 'IPv6 address', value: 'fe80::1c24...' },
        { label: 'Connection type', value: 'Ethernet' },
      ]},
    ];

    const activePerf = perfItems.find(p => p.label.startsWith(perfTab)) || perfItems[0];

    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Performance Sidebar */}
        <div className={`w-64 border-r flex flex-col ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
          {perfItems.map((item) => (
            <div 
              key={item.label}
              onClick={() => setPerfTab(item.label.split(' ')[0] as any)}
              className={`p-4 cursor-pointer border-l-4 transition-all ${perfTab === item.label.split(' ')[0] ? 'bg-blue-500/10 border-blue-500' : 'border-transparent hover:bg-white/5'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{item.label}</span>
                <span className={`text-xs font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.value}</span>
              </div>
              <div className="h-8 flex items-end gap-0.5 opacity-50">
                {item.history.slice(-20).map((v, idx) => (
                  <div key={idx} className={`flex-1 ${item.color.replace('text', 'bg')}`} style={{ height: `${v}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Performance Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{activePerf.label}</h2>
              <p className="text-xs text-zinc-500">
                {activePerf.label === 'CPU' ? 'Intel(R) Core(TM) i9-12900K CPU @ 3.20GHz' : 
                 activePerf.label === 'Memory' ? '32.0 GB DDR5' :
                 activePerf.label.startsWith('Disk') ? 'NVMe Samsung SSD 980 PRO' :
                 'Killer E3100G 2.5 Gigabit Ethernet Controller'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {activePerf.label === 'Memory' ? `${((vitals.memory/32)*100).toFixed(0)}%` : activePerf.value.split(' ')[0]}
              </div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Utilization</div>
            </div>
          </div>

          <div className={`relative h-64 border rounded-lg mb-8 overflow-hidden ${isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={`border ${isDark ? 'border-white/5' : 'border-zinc-200/50'}`} />
              ))}
            </div>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path
                d={`M 0 256 ${activePerf.history.map((v, i) => `L ${(i / 59) * 1000} ${256 - (v / 100) * 256}`).join(' ')} L 1000 256 Z`}
                fill={`url(#${activePerf.label}Gradient)`}
                className="opacity-20"
              />
              <path
                d={`M 0 ${256 - (activePerf.history[0] / 100) * 256} ${activePerf.history.map((v, i) => `L ${(i / 59) * 1000} ${256 - (v / 100) * 256}`).join(' ')}`}
                fill="none"
                stroke={activePerf.stroke}
                strokeWidth="2"
              />
              <defs>
                <linearGradient id={`${activePerf.label}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activePerf.stroke} />
                  <stop offset="100%" stopColor={activePerf.stroke} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activePerf.details.map(stat => (
              <div key={stat.label}>
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">{stat.label}</div>
                <div className={`text-lg font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="flex-1 p-8">
      <div className={`overflow-hidden border rounded-lg ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
        <table className="w-full text-left">
          <thead className={`text-[11px] font-medium ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-50 text-zinc-500'}`}>
            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
              <th className="p-4 pl-6 font-normal">User</th>
              <th className="p-4 font-normal text-right">Status</th>
              <th className="p-4 font-normal text-right">CPU</th>
              <th className="p-4 font-normal text-right">Memory</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <tr className={`${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <td className="p-4 pl-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <div className="font-medium">{currentUser?.name || 'Active User'}</div>
                  <div className="text-[10px] text-zinc-500">{currentUser?.email || 'console'}</div>
                </div>
              </td>
              <td className="p-4 text-right">
                <span className="text-emerald-500 flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </td>
              <td className="p-4 text-right font-mono text-zinc-500">{vitals.cpu.toFixed(1)}%</td>
              <td className="p-4 text-right font-mono text-zinc-500">{vitals.memory.toFixed(1)} GB</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-[#1c1c1c] text-white' : 'bg-white text-zinc-900'}`}>
      {/* App Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-white/5 bg-[#252525]' : 'border-zinc-200 bg-slate-50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          <span className="text-[11px] font-medium opacity-80 uppercase tracking-widest">Task Manager</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <RefreshCw size={12} className="text-zinc-500" />
            <span className="text-[10px] text-zinc-500">Updated: Just now</span>
          </div>
          <MoreHorizontal size={14} className="text-zinc-500 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div 
          className={`relative border-r transition-all duration-300 ${isSidebarExpanded ? 'w-56' : 'w-12'} ${isDark ? 'border-white/5 bg-[#252525]' : 'border-zinc-200 bg-slate-50'}`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          <div className="flex flex-col gap-1 p-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex items-center gap-4 p-2.5 rounded-md transition-all ${
                  activeTab === item.id 
                    ? (isDark ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-blue-600') 
                    : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-zinc-200/50')
                }`}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {isSidebarExpanded && <span className="text-xs font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'processes' && renderProcesses()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'users' && renderUsers()}
          {['details', 'services'].includes(activeTab) && (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs italic">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon in System Kernel Update
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
