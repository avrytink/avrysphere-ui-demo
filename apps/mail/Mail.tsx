
import React, { useState } from 'react';
import { Mail as MailIcon, Inbox, Send, Trash2, Star, Archive, Search, Menu } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Mail: React.FC = () => {
  const { theme } = useOSStore();
  const [selectedMail, setSelectedMail] = useState(0);
  const emails = [
    { from: 'GitHub Enterprise', subject: 'avryOS: Security Alert', body: 'Potential vulnerability detected in dependencies...', time: '12:05 PM', read: false },
    { from: 'DigitalOcean', subject: 'Invoice for October 2024', body: 'Your invoice is ready for download. Total: $42.00', time: 'Yesterday', read: true },
    { from: 'Vercel', subject: 'Deployment Successful', body: 'The latest build of your project is now live at avryos.io', time: 'Oct 24', read: true },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col md:flex-row h-full text-sm ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Sidebar - Hidden on mobile by default */}
      <div className={`hidden md:flex w-56 border-r flex-col p-4 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-zinc-50/50'}`}>
        <button className="w-full py-3 bg-red-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-white">Compose</button>
        <div className="space-y-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className={`flex items-center gap-3 p-3 border-r-2 border-red-500 ${isDark ? 'text-white bg-white/5' : 'text-black bg-white shadow-sm'}`}><Inbox size={14} /> Inbox</div>
          <div className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-200/50'}`}><Send size={14} /> Sent</div>
          <div className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-200/50'}`}><Star size={14} /> Starred</div>
          <div className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-200/50'}`}><Archive size={14} /> Archive</div>
          <div className={`flex items-center gap-3 p-3 transition-colors cursor-pointer text-red-900 ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-200/50'}`}><Trash2 size={14} /> Trash</div>
        </div>
      </div>

      {/* Mail List */}
      <div className={`w-full md:w-96 border-b md:border-b-0 md:border-r flex flex-col overflow-y-auto h-48 md:h-full shrink-0 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input className={`w-full border py-2 pl-9 text-[10px] uppercase outline-none focus:border-white/30 ${isDark ? 'bg-[#050505] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} placeholder="Search Mail..." />
          </div>
        </div>
        {emails.map((e, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedMail(i)}
            className={`p-6 border-b cursor-pointer transition-all ${isDark ? 'border-white/5' : 'border-zinc-100'} ${selectedMail === i ? (isDark ? 'bg-white/5' : 'bg-zinc-50 border-l-2 border-l-red-500') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-white')}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs uppercase font-bold tracking-tight ${e.read ? 'text-gray-500' : (isDark ? 'text-white' : 'text-black')}`}>{e.from}</span>
              <span className="text-[9px] text-gray-500">{e.time}</span>
            </div>
            <p className={`text-[11px] mb-1 ${e.read ? 'text-gray-400' : (isDark ? 'text-white font-medium' : 'text-zinc-800 font-medium')}`}>{e.subject}</p>
            <p className="text-[10px] text-gray-600 line-clamp-1">{e.body}</p>
          </div>
        ))}
      </div>

      {/* Mail Content */}
      <div className={`flex-1 flex flex-col overflow-y-auto ${isDark ? 'bg-white/[0.01]' : 'bg-white'}`}>
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className={`text-xl md:text-2xl font-light tracking-tight mb-2 uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>{emails[selectedMail].subject}</h2>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <span>From: {emails[selectedMail].from}</span>
                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                <span>To: me@avryos.local</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={`p-2 border ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'}`}><Star size={14} /></button>
              <button className={`p-2 border ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'}`}><Trash2 size={14} /></button>
            </div>
          </div>
          <div className={`text-sm leading-relaxed whitespace-pre-wrap font-light ${isDark ? 'text-gray-300' : 'text-zinc-800'}`}>
            {emails[selectedMail].body}
            {"\n\n"}Regards,{"\n"}System Administrator
          </div>
        </div>
      </div>
    </div>
  );
};
