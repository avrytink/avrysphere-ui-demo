
import React, { useRef } from 'react';
import { useTopBarStore } from '../../../store/topBarStore';
import { useWindowStore } from '../../../store/windowStore';
import { useDockStore } from '../../../store/dockStore';
import { useOSStore } from '../../../store/osStore';
import { format } from 'date-fns';
import { AppId } from '../../../types';
import { APP_REGISTRY } from '../../../registry/AppRegistry';
import { Search, Mic, Sun, Calendar } from 'lucide-react';

const FAVORITES = [
  AppId.CALL,
  AppId.MESSAGES,
  AppId.BROWSER,
  AppId.MUSIC, // Replaces Camera for web OS context
  AppId.FILES
];

export const MobileHomeScreen: React.FC = () => {
  const { dateTime } = useTopBarStore();
  const { openWindow } = useWindowStore();
  const { setLauncherOpen, toggleLauncher } = useDockStore();
  const { toggleSpotlight } = useOSStore();

  const startY = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;
    // Threshold for swipe up
    if (diff > 50) {
      setLauncherOpen(true);
    }
  };

  // Mouse fallback for testing on desktop
  const onMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    const diff = startY.current - e.clientY;
    if (diff > 50) {
      setLauncherOpen(true);
    }
  };

  return (
    <div 
      className="absolute inset-0 flex flex-col pt-16 pb-12 px-6 animate-in fade-in duration-700"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      
      {/* At A Glance Widget */}
      <div className="mt-8 mb-auto pointer-events-none">
        <div className="flex flex-col">
          <div className="text-5xl font-medium tracking-tight text-white drop-shadow-md">
            {format(dateTime, 'EEE, MMM d')}
          </div>
          <div className="flex items-center gap-3 mt-3 text-white/90 font-medium text-sm drop-shadow-md">
            <div className="flex items-center gap-1">
               <Sun size={16} /> 
               <span>72°F</span>
            </div>
            <div className="w-1 h-1 bg-white/60 rounded-full" />
            <div className="flex items-center gap-1">
               <Calendar size={14} className="mb-0.5" /> 
               <span>14:00 Team Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        
        {/* Favorites Grid */}
        <div className="flex justify-between items-center px-2">
          {FAVORITES.map(appId => {
            const app = APP_REGISTRY[appId];
            return (
              <button 
                key={appId}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent swipe trigger
                  openWindow(appId);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform duration-200"
              >
                <div className={`w-14 h-14 rounded-full ${app.iconImage ? 'bg-black' : `bg-gradient-to-br ${app.gradient}`} flex items-center justify-center shadow-lg overflow-hidden`}>
                  {app.iconImage ? (
                    <img src={app.iconImage} className="w-full h-full object-cover" alt={app.title} />
                  ) : (
                    <app.icon size={24} className="text-white" />
                  )}
                </div>
                {/* <span className="text-[10px] text-white/90 drop-shadow-md">{app.title}</span> */}
              </button>
            );
          })}
        </div>

        {/* Search Bar (Pixel Style) */}
        <div className="relative w-full">
          <div 
            onClick={(e) => {
                e.stopPropagation();
                toggleLauncher();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-full bg-[#1C1C1C]/90 backdrop-blur-xl border border-white/10 h-14 rounded-full flex items-center px-5 gap-4 shadow-xl active:bg-[#2C2C2C] transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2Z" stroke="#4285F4" strokeWidth="3"/>
                </svg>
            </div>
            <span className="text-zinc-400 text-sm font-medium">Search your phone</span>
            <div className="ml-auto flex items-center gap-4 text-zinc-400">
               <Mic size={20} />
               <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="User" />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
