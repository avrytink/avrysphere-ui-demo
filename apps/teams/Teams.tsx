
import React, { useState } from 'react';
import { Users2, Hash, Video, Bell, Search, MoreVertical, AtSign, Settings, Plus } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Teams: React.FC = () => {
  const theme = useTheme();
  const [activeChannel, setActiveChannel] = useState('general');
  const channels = ['general', 'development', 'design-ops', 'marketing'];
  const users = [
    { name: 'ALEX R.', status: 'online' },
    { name: 'SARAH C.', status: 'busy' },
    { name: 'DAVID C.', status: 'online' },
    { name: 'ELENA V.', status: 'offline' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col md:flex-row text-sm ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Sidebar - Hidden on mobile */}
      <div className={`hidden md:flex w-64 border-r flex-col ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-zinc-50/50'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <h2 className={`text-xl font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>AVRY TEAMS</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Channels</h4>
            <div className="space-y-1">
              {channels.map(c => (
                <div 
                  key={c} 
                  onClick={() => setActiveChannel(c)}
                  className={`flex items-center gap-3 p-2 cursor-pointer transition-all ${activeChannel === c ? 'bg-red-600/10 text-red-500 font-bold border-r-2 border-red-500' : (isDark ? 'text-gray-500 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-black')}`}
                >
                  <Hash size={14} /> <span className="uppercase tracking-tight">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Personnel</h4>
            <div className="space-y-3 px-2">
              {users.map(u => (
                <div key={u.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'online' ? 'bg-emerald-500' : u.status === 'busy' ? 'bg-red-500' : 'bg-gray-700'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${u.status === 'offline' ? 'text-gray-700' : (isDark ? 'text-gray-300' : 'text-zinc-700')}`}>{u.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`p-4 border-t flex items-center justify-between text-gray-600 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
           <Settings size={16} className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`} />
           <AtSign size={16} className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`} />
           <Bell size={16} className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`} />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`h-16 border-b flex items-center justify-between px-6 md:px-8 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-4">
            <Hash size={18} className="text-gray-500" />
            <h3 className={`font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>{activeChannel}</h3>
          </div>
          <div className="flex items-center gap-6">
            <Search size={18} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`} />
            <Video size={18} className="text-red-500 hover:text-red-400 cursor-pointer" />
            <MoreVertical size={18} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center opacity-10">
           <div className={`text-center ${isDark ? 'text-white' : 'text-black'}`}>
              <Users2 size={64} className="mx-auto mb-4" />
              <div className="text-sm font-bold uppercase tracking-[0.5em]">No Messages in #{activeChannel}</div>
           </div>
        </div>
        <div className={`p-4 md:p-6 border-t ${isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-200'}`}>
          <div className="relative">
             <input className={`w-full border p-4 text-xs outline-none focus:border-red-600 ${isDark ? 'bg-white/[0.02] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} placeholder={`Message #${activeChannel}`} />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4 text-gray-600">
                <Plus size={18} className={`cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
