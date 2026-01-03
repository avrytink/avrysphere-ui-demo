
import React, { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Plus } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Contacts: React.FC = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState(0);
  const contacts = [
    { name: 'ALEX RIVERA', role: 'CORE DEV', email: 'alex@avryos.local', phone: '+1 555-0101', city: 'San Francisco' },
    { name: 'SARAH CONNOR', role: 'SECURITY', email: 'sarah@avryos.local', phone: '+1 555-0102', city: 'Los Angeles' },
    { name: 'DAVID CHEN', role: 'UI ARCHITECT', email: 'david@avryos.local', phone: '+1 555-0103', city: 'Seattle' },
    { name: 'ELENA V.', role: 'AI RESEARCH', email: 'elena@avryos.local', phone: '+1 555-0104', city: 'New York' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col md:flex-row text-sm ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r flex flex-col h-48 md:h-full shrink-0 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-zinc-50/50'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input className={`w-full border py-2 pl-9 pr-4 text-[10px] uppercase outline-none focus:border-red-500 ${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-zinc-200 text-black'}`} placeholder="Search..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c, i) => (
            <div 
              key={i} 
              onClick={() => setSelected(i)}
              className={`p-4 border-b cursor-pointer transition-all ${isDark ? 'border-white/5' : 'border-zinc-100'} ${selected === i ? (isDark ? 'bg-white/5 border-l-2 border-red-500' : 'bg-white shadow-sm border-l-2 border-red-500') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-100/50')}`}
            >
              <div className={`font-bold uppercase tracking-tight text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.name}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{c.role}</div>
            </div>
          ))}
        </div>
        <button className={`m-4 p-3 border flex items-center justify-center transition-colors hidden md:flex ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-900'}`}>
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 p-6 md:p-12 flex flex-col items-center overflow-y-auto">
        <div className={`w-24 h-24 md:w-32 md:h-32 border flex items-center justify-center mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-100 border-zinc-200'}`}>
          <User size={64} className="text-gray-700" />
        </div>
        <h2 className={`text-2xl md:text-3xl font-light uppercase tracking-tighter mb-2 text-center ${isDark ? 'text-white' : 'text-zinc-900'}`}>{contacts[selected].name}</h2>
        <span className="text-xs text-red-500 uppercase tracking-[0.4em] font-bold mb-12">{contacts[selected].role}</span>
        
        <div className="w-full max-w-md space-y-6">
          <div className={`flex items-center gap-6 p-4 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <Mail size={18} className="text-gray-500" />
            <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>{contacts[selected].email}</span>
          </div>
          <div className={`flex items-center gap-6 p-4 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <Phone size={18} className="text-gray-500" />
            <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>{contacts[selected].phone}</span>
          </div>
          <div className={`flex items-center gap-6 p-4 border ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
            <MapPin size={18} className="text-gray-500" />
            <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>{contacts[selected].city}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
