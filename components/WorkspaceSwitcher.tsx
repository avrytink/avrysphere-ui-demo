
import React, { useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useDockStore } from '../store/dockStore';
import { useOSStore } from '../store/osStore';
import { APP_REGISTRY } from '../registry/AppRegistry';
import { WindowPreview } from './WindowPreview';
import { X, Plus, Trash2, Search } from 'lucide-react';

export const WorkspaceSwitcher: React.FC = () => {
  const { workspacePanelOpen, toggleWorkspacePanel } = useDockStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace, windows, addWorkspace, removeWorkspace, focusWindow } = useWindowStore();
  const { theme } = useOSStore();
  const activeRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Auto-scroll to active workspace when opened
  useEffect(() => {
    if (workspacePanelOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [workspacePanelOpen, activeWorkspaceId]);

  if (!workspacePanelOpen) return null;

  return (
    <div 
        className={`fixed inset-0 z-[5000] backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col ${isDark ? 'bg-zinc-950/60' : 'bg-zinc-50/60'}`}
        onClick={() => toggleWorkspacePanel()}
    >
      {/* Top Search Area */}
      <div className="pt-12 pb-4 flex justify-center w-full relative z-20 pointer-events-none">
        <div className={`relative group w-96 pointer-events-auto transition-transform duration-300 hover:scale-105`}>
           <Search className={`absolute left-5 top-1/2 -translate-y-1/2 opacity-50 ${isDark ? 'text-white' : 'text-black'}`} size={18} />
           <input 
             className={`w-full py-4 pl-14 pr-6 rounded-full outline-none text-sm font-bold shadow-2xl transition-all ${isDark ? 'bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500 focus:bg-black focus:border-blue-500' : 'bg-white border border-black/5 text-black placeholder:text-zinc-400 focus:border-blue-500'}`}
             placeholder="Type to search..."
             autoFocus
             onClick={e => e.stopPropagation()}
           />
        </div>
      </div>

      {/* Main Workspace Horizontal Slider */}
      <div 
        className="flex-1 flex items-center overflow-x-auto overflow-y-hidden no-scrollbar px-[20vw] snap-x snap-mandatory gap-10 pb-20 pt-10"
        onClick={e => e.stopPropagation()}
      >
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          const wsWindows = windows.filter(w => w.workspaceId === ws.id && !w.isMinimized);

          return (
            <div 
                key={ws.id} 
                ref={isActive ? activeRef : null}
                className="snap-center shrink-0 flex flex-col items-center gap-6 group perspective-1000"
            >
              {/* Workspace Card */}
              <div 
                onClick={() => { setActiveWorkspace(ws.id); toggleWorkspacePanel(); }}
                className={`
                  relative w-[60vw] max-w-[900px] aspect-video rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-2xl
                  ${isActive 
                    ? 'scale-100 ring-2 ring-blue-500/50 shadow-blue-900/30 translate-y-0 opacity-100 z-10' 
                    : 'scale-[0.85] opacity-50 hover:opacity-90 hover:scale-[0.88] translate-y-4 hover:translate-y-2 grayscale-[0.5] hover:grayscale-0'
                  }
                  ${isDark ? 'bg-zinc-900 border border-white/10' : 'bg-white border border-black/10'}
                `}
              >
                {/* Wallpaper Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url('${ws.background}')` }}
                />
                {/* Dimming Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-0' : (isDark ? 'bg-black/40 opacity-100' : 'bg-white/40 opacity-100')}`} />

                {/* Window Miniatures - Centered Grid Layout */}
                <div className="absolute inset-0 flex flex-wrap items-center justify-center content-center gap-8 p-12">
                  {wsWindows.map((win) => {
                    const app = APP_REGISTRY[win.appId];
                    return (
                      <div 
                        key={win.instanceId}
                        className="relative group/win transition-all duration-300 hover:scale-105 hover:z-20"
                        style={{ width: '22%', aspectRatio: '1.5' }}
                      >
                        <WindowPreview
                          win={win}
                          isDark={isDark}
                          isActive={false}
                          className="w-full h-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWorkspace(ws.id);
                            focusWindow(win.instanceId);
                            toggleWorkspacePanel();
                          }}
                        />

                        {/* Floating App Icon Badge - Bottom Center Overlay */}
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-xl rounded-2xl p-2 border border-white/10 transform transition-transform group-hover/win:scale-110 z-30 ${app.iconImage ? 'bg-black' : `bg-gradient-to-br ${app.gradient}`}`}>
                           {app.iconImage ? (
                              <img src={app.iconImage} className="w-5 h-5 object-cover rounded-lg" alt={app.title} />
                           ) : (
                              <app.icon size={20} className="text-white drop-shadow-md" />
                           )}
                        </div>
                        
                        {/* Title Tooltip */}
                        <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover/win:opacity-100 transition-opacity whitespace-nowrap bg-black/60 px-3 py-1 rounded-full backdrop-blur-md pointer-events-none z-30">
                            {win.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hover Controls */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
                   {workspaces.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeWorkspace(ws.id); }}
                        className="p-3 rounded-full bg-black/60 text-white hover:bg-red-600 backdrop-blur-md transition-colors border border-white/10 hover:border-red-500 hover:rotate-90 duration-300"
                        title="Delete Workspace"
                      >
                        <Trash2 size={18} />
                      </button>
                   )}
                </div>
              </div>

              {/* Workspace Label */}
              <div className={`text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 transform ${isActive ? (isDark ? 'text-white translate-y-0' : 'text-zinc-900 translate-y-0') : 'text-transparent translate-y-4'}`}>
                {ws.name}
              </div>
            </div>
          );
        })}

        {/* Add Workspace Button */}
        <div className="snap-center shrink-0 flex items-center justify-center px-12">
            <button 
                onClick={(e) => { e.stopPropagation(); addWorkspace(); }}
                className={`
                    w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-300 group
                    ${isDark 
                        ? 'border-white/20 text-white/50 hover:text-white hover:border-white hover:bg-white/10' 
                        : 'border-black/20 text-black/50 hover:text-black hover:border-black hover:bg-black/5'}
                `}
                title="Create New Workspace"
            >
                <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
        
      </div>
    </div>
  );
};
