
import React, { useState } from 'react';
import { Send, Search, MoreVertical, User } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Messages: React.FC = () => {
  const { theme } = useOSStore();
  const [activeChat, setActiveChat] = useState(0);
  const contacts = [
    { name: 'ALEX R.', last: 'The kernel is stable.', time: '10:42', unread: 2 },
    { name: 'SARAH CORE', last: 'Meeting moved to 15:00', time: '09:15', unread: 0 },
    { name: 'DEV OPS', last: 'Server #4 is back online.', time: 'Yesterday', unread: 0 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col md:flex-row h-full text-sm ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Contact List */}
      <div className={`w-full md:w-72 border-b md:border-b-0 md:border-r flex flex-col h-48 md:h-full shrink-0 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-zinc-50/50'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className={`w-full border py-2 pl-9 pr-4 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-red-500 transition-colors ${isDark ? 'bg-black border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} placeholder="Search Threads..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c, i) => (
            <div 
              key={i} 
              onClick={() => setActiveChat(i)}
              className={`p-4 border-b cursor-pointer transition-colors ${isDark ? 'border-white/5' : 'border-zinc-100'} ${activeChat === i ? (isDark ? 'bg-white/5 border-l-2 border-l-red-500' : 'bg-white shadow-sm border-l-2 border-l-red-500') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50')}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold uppercase tracking-tight text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.name}</span>
                <span className="text-[9px] text-gray-500">{c.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[10px] truncate w-40 ${isDark ? 'text-gray-400' : 'text-zinc-500'}`}>{c.last}</p>
                {c.unread > 0 && <span className="bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{c.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`h-14 border-b flex items-center justify-between px-6 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center border ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
              <User size={16} />
            </div>
            <span className={`font-bold uppercase tracking-[0.2em] text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>{contacts[activeChat].name}</span>
          </div>
          <MoreVertical size={16} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`} />
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex justify-start">
            <div className={`border p-3 max-w-[85%] md:max-w-[70%] ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-zinc-200'}`}>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white' : 'text-zinc-800'}`}>Status update on the avryOS 2.0 deployment?</p>
              <span className="text-[8px] text-gray-500 mt-1 block">10:40</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-red-600/10 border border-red-600/30 p-3 max-w-[85%] md:max-w-[70%]">
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white' : 'text-zinc-900'}`}>The kernel is stable. Moving to UI integration testing.</p>
              <span className="text-[8px] text-red-500/50 mt-1 block">10:42</span>
            </div>
          </div>
        </div>
        <div className={`p-4 border-t ${isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-200'}`}>
          <div className="flex gap-2">
            <input className={`flex-1 border p-2 text-xs outline-none focus:border-red-500 ${isDark ? 'bg-white/[0.02] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} placeholder="Type message..." />
            <button className="w-10 h-10 bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors text-white">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
