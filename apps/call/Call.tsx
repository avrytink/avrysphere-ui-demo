
import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, Video, Grid, User, Volume2 } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Call: React.FC = () => {
  const { theme } = useOSStore();
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const addDigit = (digit: string) => setNumber(prev => prev + digit);
  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {!isCalling ? (
        <div className="w-full max-w-xs space-y-8">
          <div className="text-center h-12 flex items-center justify-center">
            <span className={`text-3xl font-mono tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>{number || "Enter number"}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(n => (
              <button 
                key={n} 
                onClick={() => addDigit(String(n))}
                className={`h-16 border flex flex-col items-center justify-center transition-colors ${isDark ? 'border-white/10 hover:bg-white/5 active:bg-white/10 text-white' : 'border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 text-zinc-900'}`}
              >
                <span className="text-xl font-mono">{n}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setNumber('')}
              className={`flex-1 h-14 border uppercase text-[10px] font-bold tracking-widest ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}
            >
              Clear
            </button>
            <button 
              onClick={() => number && setIsCalling(true)}
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs flex flex-col items-center space-y-12">
          <div className="text-center">
            <div className={`w-24 h-24 flex items-center justify-center mb-6 mx-auto ${isDark ? 'bg-white/5 border border-white/10' : 'bg-zinc-100 border border-zinc-200'}`}>
              <User size={48} className="text-gray-500" />
            </div>
            <div className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{number}</div>
            <div className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] animate-pulse">Calling...</div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <button className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}><Mic size={20} /></button>
            <button className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}><Video size={20} /></button>
            <button className={`w-12 h-12 rounded-full border flex items-center justify-center ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-900'}`}><Volume2 size={20} /></button>
          </div>

          <button 
            onClick={() => setIsCalling(false)}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-900/40"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
