
import React, { useState, useEffect, useMemo } from 'react';
import { useOSStore } from '../../../store/osStore';
import { useAuthStore } from '../../../store/authStore';
import { useWindowStore } from '../../../store/windowStore';
import { APP_REGISTRY } from '../../../registry/AppRegistry';
import { AppId } from '../../../types';
import { Window } from '../../Window';
import { TVHome } from './TVHome';
import { 
  Search, 
  Home, 
  Library, 
  Settings, 
  User, 
  Monitor, 
  Wifi, 
  Clock 
} from 'lucide-react';
import { format } from 'date-fns';

export const TVLayout: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { windows, activeWorkspaceId, closeWindow, openWindow } = useWindowStore();
  const { wifiEnabled } = useOSStore();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'settings'>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // TV mode forces specific behavior: only show the topmost active window if present
  // Otherwise show dashboard. Explicitly exclude TV_MODE app to avoid recursion.
  const activeWindows = useMemo(() => 
    windows.filter(w => w.workspaceId === activeWorkspaceId && w.isOpen && !w.isMinimized && w.appId !== AppId.TV_MODE), 
  [windows, activeWorkspaceId]);

  // Find the top-most window
  const activeWindow = activeWindows.length > 0 
    ? activeWindows.sort((a, b) => b.zIndex - a.zIndex)[0] 
    : null;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const renderAppContent = (appId: AppId) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return null;
    const AppComponent = appDef.component;
    return <AppComponent />;
  };

  const navItems = [
    { id: 'search', icon: Search, label: 'Search', action: () => {} },
    { id: 'home', icon: Home, label: 'Home', action: () => setActiveTab('home') },
    { id: 'library', icon: Library, label: 'Library', action: () => setActiveTab('library') },
    { id: 'desktop', icon: Monitor, label: 'Desktop', action: () => openWindow(AppId.DESKTOP_MODE) },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => openWindow(AppId.SETTINGS) },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white font-sans selection:bg-white/20 select-none relative">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-50" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,50,255,0.15),transparent_50%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex h-full">
        
        {/* TV Sidebar */}
        <div 
          className={`h-full flex flex-col items-center py-12 transition-all duration-300 z-50 ${sidebarExpanded ? 'w-64 bg-black/80 backdrop-blur-xl border-r border-white/10' : 'w-24 bg-transparent'}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <div className="flex flex-col gap-8 w-full px-4">
            {/* Profile Bubble */}
            <div className={`flex items-center gap-4 p-2 rounded-full transition-all ${sidebarExpanded ? 'bg-white/10' : ''}`}>
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                 <img src={currentUser?.avatar || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
               </div>
               {sidebarExpanded && (
                 <div className="flex flex-col">
                    <span className="text-sm font-bold truncate">{currentUser?.name}</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Primary</span>
                 </div>
               )}
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-2 mt-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`
                    flex items-center gap-5 p-4 rounded-xl transition-all duration-200 group
                    ${activeTab === item.id && !activeWindow ? 'text-white' : 'text-zinc-400 hover:text-white'}
                    ${sidebarExpanded ? 'hover:bg-white/10' : ''}
                  `}
                >
                  <item.icon 
                    size={24} 
                    className={`transition-transform duration-200 ${activeTab === item.id && !activeWindow ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} 
                  />
                  {sidebarExpanded && (
                    <span className={`text-sm font-bold tracking-wide ${activeTab === item.id && !activeWindow ? 'text-blue-400' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Bar Status (Always visible unless Fullscreen App) */}
          {!activeWindow && (
            <div className="absolute top-0 right-0 p-8 flex items-center gap-6 z-20 text-zinc-400 font-medium">
               {wifiEnabled && <Wifi size={20} />}
               <span className="text-xl tracking-widest">{format(currentTime, 'HH:mm')}</span>
            </div>
          )}

          {/* Dashboard Content */}
          <div 
            className={`
              flex-1 overflow-y-auto overflow-x-hidden p-12 pl-4 transition-all duration-500
              ${activeWindow ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
            `}
          >
             {activeTab === 'home' && <TVHome />}
             {activeTab === 'library' && (
                <div className="flex items-center justify-center h-full text-zinc-500 font-thin text-4xl uppercase tracking-[0.5em]">
                   Library Empty
                </div>
             )}
          </div>

          {/* Active App Overlay (Simulating TV App Launch) */}
          {activeWindow && (
            <div className="absolute inset-0 z-40 bg-[#0a0a0a] animate-in zoom-in-95 duration-300 flex flex-col">
               {/* TV App Header */}
               <div className="h-16 flex items-center justify-between px-10 bg-gradient-to-b from-black/80 to-transparent z-50 shrink-0">
                  <div className="flex items-center gap-3">
                     <span className="text-lg font-bold text-white/80">{activeWindow.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-mono text-white/40">{format(currentTime, 'HH:mm')}</span>
                     <button 
                        onClick={() => closeWindow(activeWindow.instanceId)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors backdrop-blur-md"
                     >
                        Exit App
                     </button>
                  </div>
               </div>
               
               {/* App Content */}
               <div className="flex-1 relative">
                  <Window window={activeWindow}>
                    {renderAppContent(activeWindow.appId)}
                  </Window>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
