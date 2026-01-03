
import React from 'react';
import { Tv, Play, Radio, Users, Settings, Plus, Video, Film, MoreHorizontal } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const WebTV: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const channels = [
    { name: 'OS-CORE-LIVE', viewers: '14.2K', status: 'Live', bit: '6.0 Mbps' },
    { name: 'DEV-LOGS-VOD', viewers: '2.1K', status: 'Replay', bit: '4.5 Mbps' },
    { name: 'TECH-RADIO', viewers: '842', status: 'Live', bit: '128 kbps' },
  ];

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`h-auto md:h-20 py-4 md:py-0 border-b flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-10 gap-4 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <Tv size={32} className="text-purple-500" />
          <div>
            <h1 className={`text-xl md:text-2xl font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>WebTV+ Business</h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Broadcast Controller</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className={`flex-1 md:flex-none px-6 py-2 border text-[10px] font-bold uppercase tracking-widest ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}>Studio View</button>
          <button className="flex-1 md:flex-none px-6 py-2 bg-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 text-white">Go Live</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map(c => (
            <div key={c.name} className={`border p-6 hover:border-purple-600/30 transition-all cursor-pointer ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${c.status === 'Live' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {c.status}
                </div>
                <MoreHorizontal size={16} className="text-gray-600" />
              </div>
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.name}</h3>
              <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Users size={12} /> {c.viewers}</span>
                <span className="flex items-center gap-2"><Radio size={12} /> {c.bit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <h3 className={`text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] border-b pb-4 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>Library Assets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Video, title: 'B-Roll Core' },
              { icon: Film, title: 'Release Trailer' },
              { icon: Play, title: 'Keynote 2024' },
              { icon: Plus, title: 'Upload New' },
            ].map((a, i) => (
              <div key={i} className={`aspect-video border flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/5' : 'border-zinc-200 bg-white hover:bg-zinc-50'}`}>
                <a.icon size={24} className="text-gray-600 group-hover:text-purple-500 transition-colors" />
                <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-700 ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'}`}>{a.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">System Encoding Load</h3>
          <div className="h-24 flex items-end gap-1">
             {Array.from({ length: 100 }).map((_, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-purple-600/30" 
                 style={{ height: `${Math.random() * 60 + 20}%` }} 
               />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
