
import React from 'react';
import { HelpCircle, Book, MessageSquare, Terminal, Shield, Globe } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Help: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const categories = [
    { icon: Terminal, title: 'Basics', desc: 'Getting started with avryOS environment.' },
    { icon: Shield, title: 'Security', desc: 'Managing keys, permissions, and encryption.' },
    { icon: Globe, title: 'Network', desc: 'Configuring links and system endpoints.' },
    { icon: Book, title: 'Docs', desc: 'Full API and Shell documentation.' },
  ];

  return (
    <div className={`h-full p-6 md:p-12 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <HelpCircle size={48} className="text-red-600 mx-auto" />
          <h1 className={`text-4xl md:text-5xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Support Core</h1>
          <div className="relative max-w-xl mx-auto">
            <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input className={`w-full border py-4 pl-12 pr-6 text-sm uppercase tracking-widest outline-none focus:border-red-600 transition-colors ${isDark ? 'bg-white/[0.02] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'}`} placeholder="Search Knowledge Base..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(c => (
            <div key={c.title} className={`p-8 border cursor-pointer transition-all group ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-zinc-200 bg-white hover:shadow-md'}`}>
              <c.icon size={24} className="text-red-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed uppercase">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-red-600/5 border border-red-600/20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <MessageSquare size={24} className="text-red-500" />
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>Live Assistance</h4>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Chat with Gemini System Agent</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 transition-colors text-white">Start Session</button>
        </div>
      </div>
    </div>
  );
};
