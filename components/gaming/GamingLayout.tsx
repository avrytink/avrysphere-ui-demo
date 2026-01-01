
import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWindowStore } from '../../store/windowStore';
import { APP_REGISTRY, AppDefinition } from '../../registry/AppRegistry';
import { AppId } from '../../types';
import { Window } from '../Window';
import { 
  Search, Settings, User as UserIcon, Clock, Battery, Wifi, 
  Trophy, Gamepad2, Play, Heart, Share2, MoreHorizontal, X, Clapperboard
} from 'lucide-react';
import { format } from 'date-fns';

const AAA_GAMES = [
  AppId.CYBERPUNK,
  AppId.ELDEN_RING,
  AppId.GOW_RAGNAROK,
  AppId.SPIDERMAN_2,
  AppId.COD_MW3,
  AppId.BALDURS_GATE,
  AppId.STARFIELD,
  AppId.FF_XVI,
  AppId.GTA_V,
  AppId.FORTNITE
];

export const GamingLayout: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { windows, activeWorkspaceId, openWindow, closeWindow } = useWindowStore();
  
  const [selectedAppId, setSelectedAppId] = useState<string>(AAA_GAMES[0]);
  const [activeTab, setActiveTab] = useState<'games' | 'media'>('games');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Create a combined list of apps: Games first, then Mode Switchers, then a selection of system apps
  const gameApps = AAA_GAMES.map(id => APP_REGISTRY[id]).filter(Boolean);
  
  const modeSwitchers = [AppId.TV_MODE, AppId.DESKTOP_MODE, AppId.TABLET_MODE]
    .map(id => APP_REGISTRY[id])
    .filter(Boolean);

  const systemApps = Object.values(APP_REGISTRY).filter(
    app => !AAA_GAMES.includes(app.id) 
      && !app.headless 
      && app.id !== AppId.GAME_MODE
  ).slice(0, 8); // Limit standard apps for cleaner UI
  
  const allCards = [...gameApps, ...modeSwitchers, ...systemApps];

  // Find the top-most active window (to overlay), excluding the switcher itself to prevent recursion
  const activeWindow = windows
    .filter(w => w.workspaceId === activeWorkspaceId && w.isOpen && w.appId !== AppId.GAME_MODE)
    .sort((a, b) => b.zIndex - a.zIndex)[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderAppContent = (appId: AppId) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return null;
    const AppComponent = appDef.component;
    return <AppComponent />;
  };

  const getBackgroundGradient = (app: AppDefinition) => {
    // If we have an image, we use it in the style prop directly, but here we can return a fallback color
    // Extract colors from tailwind classes if possible, or fallback to hardcoded map
    if (app.gradient.includes('yellow')) return 'linear-gradient(to bottom right, #4a3b00, #1a1a1a)';
    if (app.gradient.includes('blue')) return 'linear-gradient(to bottom right, #001f4d, #1a1a1a)';
    if (app.gradient.includes('red')) return 'linear-gradient(to bottom right, #4d0000, #1a1a1a)';
    if (app.gradient.includes('purple')) return 'linear-gradient(to bottom right, #2d004d, #1a1a1a)';
    if (app.gradient.includes('emerald')) return 'linear-gradient(to bottom right, #00331a, #1a1a1a)';
    return 'linear-gradient(to bottom right, #1a1a1a, #000)';
  };

  const selectedAppDef = APP_REGISTRY[selectedAppId as AppId];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050505] text-white font-sans select-none relative">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center"
        style={{ 
            backgroundImage: selectedAppDef?.iconImage ? `url('${selectedAppDef.iconImage}')` : 'none',
            background: !selectedAppDef?.iconImage && selectedAppDef ? getBackgroundGradient(selectedAppDef) : undefined,
            opacity: activeWindow ? 0.3 : (selectedAppDef?.iconImage ? 0.6 : 1),
            filter: selectedAppDef?.iconImage ? 'blur(8px) brightness(0.6)' : 'none'
        }}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/40 z-0 pointer-events-none" />

      {/* Top Bar (PS5 Style) */}
      <div className={`absolute top-0 left-0 right-0 h-24 px-12 flex items-center justify-between z-20 transition-all duration-500 ${activeWindow ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
         <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('games')}
              className={`transition-all duration-300 ${activeTab === 'games' ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/40 hover:text-white/70'}`}
            >
              <Gamepad2 size={28} />
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`transition-all duration-300 ${activeTab === 'media' ? 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/40 hover:text-white/70'}`}
            >
              <Clapperboard size={28} />
            </button>
         </div>
         
         <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Search size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Settings size={20} /></button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                  <img src={currentUser?.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-bold text-white/90">{format(currentTime, 'h:mm a')}</span>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-end pb-12 transition-all duration-500 ${activeWindow ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
         
         {/* Hero Info (For Selected Item) */}
         <div className="px-20 mb-8 flex flex-col items-start gap-4 h-64">
            {selectedAppDef && (
               <>
                  <div className="flex items-center gap-4 mb-2">
                     <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedAppDef.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/20`}>
                        <selectedAppDef.icon size={24} className="text-white drop-shadow-md" />
                     </div>
                     <span className="text-sm font-bold uppercase tracking-widest text-white/60">Ready to Start</span>
                  </div>
                  
                  <h1 className="text-6xl font-black uppercase tracking-tight drop-shadow-2xl">{selectedAppDef.title}</h1>
                  
                  {/* Game Stats / Metadata */}
                  {AAA_GAMES.includes(selectedAppDef.id) && (
                     <div className="flex items-center gap-6 text-sm font-bold text-white/80 mt-2">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                           <Trophy size={14} className="text-yellow-400" />
                           <span>42% Progress</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                           <Clock size={14} className="text-blue-400" />
                           <span>Last played 2h ago</span>
                        </div>
                     </div>
                  )}

                  <div className="flex items-center gap-4 mt-6">
                     <button 
                        onClick={() => openWindow(selectedAppDef.id)}
                        className="h-14 px-12 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 text-sm"
                     >
                        {AAA_GAMES.includes(selectedAppDef.id) ? 'Play' : 'Open'}
                     </button>
                     <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md">
                        <MoreHorizontal size={24} />
                     </button>
                  </div>
               </>
            )}
         </div>

         {/* Horizontal Scroll List */}
         <div className="w-full overflow-x-auto no-scrollbar px-20 pb-10">
            <div className="flex gap-6 items-end">
               {allCards.map((app) => (
                  <button
                     key={app.id}
                     onClick={() => { setSelectedAppId(app.id); }}
                     onMouseEnter={() => setSelectedAppId(app.id)}
                     onDoubleClick={() => openWindow(app.id)}
                     className={`
                        relative flex-shrink-0 rounded-full overflow-hidden transition-all duration-300 group
                        ${selectedAppId === app.id 
                           ? 'w-64 h-64 ring-4 ring-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 scale-100' 
                           : 'w-40 h-40 opacity-60 hover:opacity-100 scale-95 hover:scale-100 z-10 mb-6'}
                     `}
                  >
                     {app.iconImage ? (
                        <>
                           <img src={app.iconImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={app.title} />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </>
                     ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient}`} />
                     )}
                     
                     <div className="absolute inset-0 flex items-center justify-center">
                        {!app.iconImage && (
                           <app.icon 
                              size={selectedAppId === app.id ? 48 : 32} 
                              className="text-white drop-shadow-lg transition-all duration-300" 
                           />
                        )}
                     </div>
                     
                     {/* Title Overlay for generic apps or if no image */}
                     {(!app.iconImage || selectedAppId === app.id) && (
                        <div className="absolute bottom-8 left-4 right-4 text-center">
                           <div className="text-sm font-bold text-white drop-shadow-md truncate">{app.title}</div>
                        </div>
                     )}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Active Window Overlay */}
      {activeWindow && (
         <div className="absolute inset-0 z-50 bg-black animate-in zoom-in-95 duration-300">
            {/* Gaming Overlay HUD - Close Button */}
            <div className="absolute top-6 right-6 z-[60] flex gap-4 group">
               <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  Running: {activeWindow.title}
               </div>
               <button 
                  onClick={() => closeWindow(activeWindow.instanceId)}
                  className="bg-white/10 hover:bg-red-600 text-white p-3 rounded-full transition-all backdrop-blur-md border border-white/10 hover:border-red-500 shadow-xl"
                  title="Exit Game"
               >
                  <X size={20} />
               </button>
            </div>

            <Window window={activeWindow}>
               {renderAppContent(activeWindow.appId)}
            </Window>
         </div>
      )}

    </div>
  );
};
