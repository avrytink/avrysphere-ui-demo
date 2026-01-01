
import React, { useMemo, useState, useEffect } from 'react';
import { useDockStore } from '../../store/dockStore';
import { useOSStore } from '../../store/osStore';
import { useSphereStore } from '../../store/sphereStore';
import { useWindowStore } from '../../store/windowStore';
import { useMediaStore } from '../../store/mediaStore';
import { AppId, DesktopLayout } from '../../types';
import { AppIcon } from './AppIcon';
import { PINNED_APPS } from './Constants';
import { 
  Bell, Search, Monitor, Plus, Play, Pause, SkipForward, SkipBack
} from 'lucide-react';
import { LauncherPanel } from './LauncherPanel';
import { AvryAIPanel } from './AvryAIPanel';
import { NotificationsPanel } from './NotificationsPanel';
import { ProfilePanel } from './ProfilePanel';
import { WorkspacePanel } from './WorkspacePanel';

export const MomentDock: React.FC = () => {
  const { 
    dockCollapsed, launcherOpen, toggleLauncher, notificationsOpen, toggleNotifications,
    geminiPanelOpen, toggleGeminiPanel, workspacePanelOpen, toggleWorkspacePanel,
    profileOpen, toggleProfile
  } = useDockStore();
  
  const { toggleSpotlight, theme } = useOSStore();
  const { layout, isMobile } = useSphereStore();
  const { windows, activeInstanceId, workspaces, activeWorkspaceId, setActiveWorkspace, addWorkspace } = useWindowStore();
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = useMediaStore();
  
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 12;
      if (e.clientY >= window.innerHeight - threshold) {
        setIsHoveringEdge(true);
      } else if (e.clientY < window.innerHeight - 100) {
        setIsHoveringEdge(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const runningUnpinnedApps = useMemo(() => {
    const seen = new Set<AppId>(PINNED_APPS);
    const list: AppId[] = [];
    windows.forEach(w => {
      if (!seen.has(w.appId)) {
        seen.add(w.appId);
        list.push(w.appId);
      }
    });
    return list;
  }, [windows]);

  const isDockHidden = useMemo(() => {
    const activeWin = windows.find(w => w.instanceId === activeInstanceId);
    return activeWin?.isMaximized && !activeWin.isMinimized && !isHoveringEdge && !launcherOpen && !profileOpen && !notificationsOpen && !workspacePanelOpen;
  }, [windows, activeInstanceId, isHoveringEdge, launcherOpen, profileOpen, notificationsOpen, workspacePanelOpen]);

  if (isMobile) return null;

  const isUnity = layout === DesktopLayout.UNITY;
  const isDark = theme === 'dark';

  const dockBg = isDark ? 'bg-black/30 border-white/10' : 'bg-white/30 border-white/40 shadow-xl';
  const sidebarBg = isDark ? 'bg-black/30 border-white/10' : 'bg-white/30 border-black/5';
  const iconColor = isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-black';
  const iconBgHover = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const iconActive = isDark ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-md';
  const dividerColor = isDark ? 'bg-white/10' : 'bg-black/10';

  const LauncherBtn = (
    <button onClick={toggleLauncher} className={`${isUnity ? 'w-10 h-10' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-all duration-300 ${launcherOpen ? 'bg-blue-600 text-white shadow-lg' : `${iconColor} ${iconBgHover}`}`}>
      <svg width="20" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4.29912C11.5306 2.98592 10.8961 1.49125 9.58288 0.960679C8.26966 0.430111 6.77496 1.06456 6.24438 2.37776L0.960554 15.4555C0.429977 16.7687 1.06444 18.2633 2.37766 18.7939C3.69089 19.3245 5.18559 18.69 5.71617 17.3768L11 4.29912Z" fill="currentColor"/><path d="M16.6717 13.1462C16.3048 11.7781 14.8983 10.9663 13.5301 11.3331C12.1619 11.7 11.3501 13.1065 11.717 14.4746L12.3812 16.952C12.748 18.3201 14.1545 19.1319 15.5227 18.7651C16.8909 18.3982 17.7027 16.9917 17.3359 15.6235L16.6717 13.1462Z" fill="currentColor"/></svg>
    </button>
  );

  const AppsGroup = (
    <>
      {PINNED_APPS.map(appId => <AppIcon key={appId} appId={appId} />)}
      {runningUnpinnedApps.map(appId => <AppIcon key={appId} appId={appId} />)}
    </>
  );

  const SystemGroup = (
    <>
      <button onClick={toggleNotifications} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${notificationsOpen ? iconActive : `${isDark ? 'bg-white/5' : 'bg-black/5'} ${iconColor} ${iconBgHover}`}`}><Bell size={18} /></button>
      {!isUnity && (
         <button onClick={toggleProfile} className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${profileOpen ? 'ring-2 ring-blue-600' : 'border-transparent hover:scale-105'}`}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="User" />
        </button>
      )}
    </>
  );

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 h-2 z-[800] bg-transparent transition-opacity ${isDockHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onMouseEnter={() => setIsHoveringEdge(true)} />
      {isUnity ? (
        <aside className={`fixed left-0 top-8 bottom-0 flex-col items-center py-6 backdrop-blur-3xl border-r z-[900] transition-all duration-500 rounded-r-[2rem] ${dockCollapsed ? 'w-12' : 'w-20'} ${sidebarBg} ${isDockHidden ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="flex flex-col items-center gap-6 w-full">{LauncherBtn}<div className={`w-8 h-px ${dividerColor}`} /><div className="flex flex-col items-center gap-4 w-full">{AppsGroup}</div></div>
          <div className="mt-auto flex flex-col items-center gap-4 w-full"><div className={`w-8 h-px ${dividerColor}`} />{SystemGroup}</div>
        </aside>
      ) : (
        <div onMouseEnter={() => setIsHoveringEdge(true)} className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[900] flex items-end gap-3 transition-all duration-700 cubic-bezier(0.32,0.72,0,1) ${isDockHidden ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
          
          {/* Launcher */}
          <div className={`relative flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}>{LauncherBtn}</div>
          
          {/* Apps */}
          <div className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}>{AppsGroup}</div>
          
          {/* Workspaces - w-12 increased to w-[53px] (approx 10%) */}
          <div className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}>
             <div className="flex items-center gap-2">
               {workspaces.slice(0, 4).map(ws => (
                 <button key={ws.id} onClick={() => setActiveWorkspace(ws.id)} className={`w-[53px] h-10 rounded-full bg-cover bg-center transition-all ${activeWorkspaceId === ws.id ? 'border-2 border-white brightness-110 shadow-lg' : 'border border-white/30 opacity-60 hover:opacity-100'}`} style={{ backgroundImage: `url('${ws.background}')` }} />
               ))}
               <button onClick={addWorkspace} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 transition-all border border-white/10"><Plus size={18} /></button>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <button onClick={toggleWorkspacePanel} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${workspacePanelOpen ? iconActive : `${isDark ? 'bg-white/5' : 'bg-black/5'} ${iconColor} border border-white/10`}`}><Monitor size={18} /></button>
          </div>

          {/* Media Zone - Unified button sizes to w-10 h-10 */}
          <div className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all group relative h-16 ${dockBg}`}>
             <div className="flex items-center gap-3">
                <div className="relative group/media">
                  <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform duration-500 shadow-lg ${isPlaying ? 'border-red-500 animate-[spin_8s_linear_infinite]' : 'border-white/20'}`}>
                    <img src={currentTrack.cover} className="w-full h-full object-cover" alt="Album" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover/media:opacity-100 transition-all pointer-events-none scale-90 group-hover/media:scale-100 whitespace-nowrap z-[1001] shadow-2xl">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{currentTrack.title}</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{currentTrack.artist}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black/80" />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                   <button onClick={prevTrack} className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                      <SkipBack size={14} className="text-white/60" fill="currentColor" />
                   </button>
                   <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                      {isPlaying ? <Pause size={14} className="text-white" fill="white" /> : <Play size={14} className="text-white ml-0.5" fill="white" />}
                   </button>
                   <button onClick={nextTrack} className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                      <SkipForward size={14} className="text-white/60" fill="white" />
                   </button>
                </div>
             </div>
          </div>

          {/* Search Zone - Unified Style */}
          <div className={`flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}>
             <button onClick={toggleSpotlight} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconColor} ${iconBgHover}`}><Search size={20} /></button>
          </div>

          {/* System Group */}
          <div className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}>{SystemGroup}</div>
        </div>
      )}
      {launcherOpen && <LauncherPanel />}
      {geminiPanelOpen && <AvryAIPanel onClose={toggleGeminiPanel} />}
      {notificationsOpen && <NotificationsPanel onClose={toggleNotifications} />}
      {workspacePanelOpen && <WorkspacePanel />}
      {profileOpen && !isUnity && <ProfilePanel />}
    </>
  );
};
