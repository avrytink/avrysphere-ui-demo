
import React, { useRef, useState } from 'react';
import { useDockStore } from '../../../store/dockStore';
import { useWindowStore } from '../../../store/windowStore';
import { useOSStore } from '../../../store/osStore';
import { APP_REGISTRY } from '../../../registry/AppRegistry';
import { Search } from 'lucide-react';
import { AppId } from '../../../types';

export const MobileLauncher: React.FC = () => {
  const { launcherOpen, setLauncherOpen } = useDockStore();
  const { openWindow } = useWindowStore();
  const { theme } = useOSStore();
  const [search, setSearch] = useState('');
  
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState(0);

  const isDark = theme === 'dark';

  // Styles
  const panelBg = isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/5';
  const inputBg = isDark ? 'bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/20' : 'bg-white border border-zinc-200 text-black placeholder:text-zinc-400 focus:border-zinc-300';
  const handleColor = isDark ? 'bg-zinc-600/50' : 'bg-zinc-300';
  const textColor = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const iconBorder = isDark ? 'border-white/5' : 'border-black/5';

  if (!launcherOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      setLauncherOpen(false);
    }
    setStartY(null);
    setCurrentY(0);
  };

  const filteredApps = Object.values(APP_REGISTRY).filter(app => {
      if (app.id === AppId.TABLET_MODE || app.id === AppId.DESKTOP_MODE) return false;
      return app.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col transition-transform duration-300 ease-out"
      style={{ 
        transform: `translateY(${currentY}px)`, 
        transition: startY ? 'none' : 'transform 0.3s ease-out' 
      }}
    >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setLauncherOpen(false)} />
        
        <div 
            className={`
              flex-1 backdrop-blur-3xl rounded-t-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl mt-4 border-t
              ${panelBg}
            `}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Handle / Pill */}
            <div className="w-full flex justify-center pt-4 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
                <div className={`w-12 h-1.5 rounded-full ${handleColor}`} />
            </div>

            {/* Search */}
            <div className="px-6 py-4 shrink-0">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        className={`w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all ${inputBg}`}
                        placeholder="Search apps..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onMouseDown={e => e.stopPropagation()} 
                        onTouchStart={e => e.stopPropagation()}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 no-scrollbar" onTouchStart={e => e.stopPropagation()}>
                <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                    {filteredApps.map(app => (
                        <button 
                            key={app.id}
                            onClick={() => {
                                openWindow(app.id);
                                setLauncherOpen(false);
                            }}
                            className="flex flex-col items-center gap-3 group active:scale-95 transition-transform"
                        >
                            <div className={`w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg border ${iconBorder}`}>
                                <app.icon size={31} className="text-white drop-shadow-md" />
                            </div>
                            <span className={`text-[11px] font-medium text-center leading-tight tracking-tight ${textColor}`}>{app.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
