
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOSStore } from '../../store/osStore';
import { useWindowStore } from '../../store/windowStore';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { Search, Command, ArrowRight, AlertCircle, Sparkles, Terminal } from 'lucide-react';

export const Spotlight: React.FC = () => {
  const { spotlightOpen, setSpotlightOpen, launchUrl, theme } = useOSStore();
  const { openWindow } = useWindowStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCommand = query.startsWith('avry://');
  const isDark = theme === 'dark';

  // Enhanced Contrast Styles
  const panelBg = isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-white/40';
  const inputColor = isDark ? 'text-white placeholder:text-zinc-500' : 'text-black placeholder:text-zinc-400';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const itemHover = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';
  const iconColor = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const kbdBg = isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10';

  const results = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery || isCommand) return [];
    
    return Object.values(APP_REGISTRY).filter(app => 
      app.title.toLowerCase().includes(trimmedQuery) ||
      app.id.toLowerCase().includes(trimmedQuery)
    ).slice(0, 7);
  }, [query, isCommand]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (spotlightOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [spotlightOpen]);

  if (!spotlightOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSpotlightOpen(false);
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isCommand) {
        launchUrl(query);
      } else {
        const selectedApp = results[selectedIndex];
        if (selectedApp) {
          openWindow(selectedApp.id);
          setSpotlightOpen(false);
        }
      }
    }

    if (results.length > 0 && !isCommand) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[4000] flex items-start justify-center pt-32 bg-black/10 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setSpotlightOpen(false)}
    >
      <div 
        className={`
          w-full max-w-2xl backdrop-blur-3xl border rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300
          ${panelBg}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className={`relative flex items-center border-b px-8 transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          {isCommand ? (
            <Terminal size={22} className="text-emerald-500 mr-4 animate-pulse" />
          ) : (
            <Search size={22} className={`${iconColor} mr-4`} />
          )}
          
          <input 
            ref={inputRef}
            autoFocus
            className={`w-full bg-transparent py-8 text-2xl outline-none font-light tracking-tight transition-colors ${isCommand ? 'text-emerald-500' : inputColor}`}
            placeholder="Search modalities, commands, and files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-3 ml-4">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${kbdBg}`}>
              <Command size={10} className={iconColor} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>ESC</span>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[480px] overflow-y-auto no-scrollbar">
          {isCommand ? (
             <div className="p-20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Terminal size={32} className="text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h3 className={`text-lg font-black uppercase tracking-tighter ${textPrimary}`}>System Command Active</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${textSecondary}`}>
                    Press Enter to execute protocol
                  </p>
                </div>
             </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-1">
              <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] ${textSecondary}`}>Applications</div>
              {results.map((app, i) => (
                <div 
                  key={app.id}
                  onClick={() => { openWindow(app.id); setSpotlightOpen(false); }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 group
                    ${selectedIndex === i 
                      ? 'bg-red-600 shadow-lg shadow-red-600/20 scale-[1.01]' 
                      : `${itemHover} ${textSecondary}`}
                  `}
                >
                  <div className="flex items-center gap-5">
                    <div className={`
                      p-3 rounded-full transition-colors flex items-center justify-center overflow-hidden
                      ${selectedIndex === i ? 'bg-white/20' : (isDark ? 'bg-zinc-800 border border-white/5' : 'bg-white/50 border border-black/5')}
                      ${app.iconImage ? 'w-11 h-11' : ''}
                    `}>
                      {app.iconImage ? (
                        <img src={app.iconImage} className="w-6 h-6 object-cover rounded-lg" alt={app.title} />
                      ) : (
                        <app.icon size={20} className={selectedIndex === i ? 'text-white' : iconColor} />
                      )}
                    </div>
                    <div>
                      <span className={`text-sm font-bold uppercase tracking-widest ${selectedIndex === i ? 'text-white' : textPrimary}`}>
                        {app.title}
                      </span>
                      <p className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 ${selectedIndex === i ? 'text-white/60' : textSecondary}`}>
                        Modality / System App
                      </p>
                    </div>
                  </div>
                  {selectedIndex === i && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Open</span>
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            /* No Results State */
            <div className="p-20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-black/5 border-black/5'}`}>
                <AlertCircle size={32} className={iconColor} />
              </div>
              <div className="space-y-1">
                <h3 className={`text-lg font-black uppercase tracking-tighter ${textPrimary}`}>No results for "{query}"</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${textSecondary}`}>
                  Try searching for a system modality like "Terminal" or "Gemini"
                </p>
              </div>
            </div>
          ) : (
            /* Initial / Empty State */
            <div className="p-20 text-center flex flex-col items-center gap-6 opacity-40">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <Sparkles size={48} className="relative text-red-600" />
              </div>
              <div className="space-y-2">
                <p className={`text-xs font-black uppercase tracking-[0.4em] ${textSecondary}`}>Neural Spotlight Interface</p>
                <div className={`flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <span>Alt + Space</span>
                  <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
                  <span>Global Command Search</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        {results.length > 0 && (
          <div className={`px-8 py-4 border-t flex items-center justify-between ${isDark ? 'bg-zinc-950/20 border-white/5' : 'bg-white/20 border-black/5'}`}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>Navigate</span>
                <div className="flex gap-1">
                  <div className={`px-1.5 py-0.5 rounded border text-[8px] font-mono ${textSecondary} ${kbdBg}`}>↑</div>
                  <div className={`px-1.5 py-0.5 rounded border text-[8px] font-mono ${textSecondary} ${kbdBg}`}>↓</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>Select</span>
                <div className={`px-1.5 py-0.5 rounded border text-[8px] font-mono ${textSecondary} ${kbdBg}`}>ENTER</div>
              </div>
            </div>
            <div className={`text-[8px] font-black uppercase tracking-widest ${textSecondary}`}>avryOS Core Link v1.0</div>
          </div>
        )}
      </div>
    </div>
  );
};
