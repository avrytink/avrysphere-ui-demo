
import React, { useState } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { useDockStore } from '../../store/dockStore';
import { useOSStore } from '../../store/osStore';
import { useSphereStore } from '../../store/sphereStore';
import { AppId, DesktopLayout } from '../../types';
import { APP_REGISTRY } from '../../registry/AppRegistry';

interface AppIconProps {
  appId: AppId;
}

export const AppIcon: React.FC<AppIconProps> = ({ appId }) => {
  const { openWindow, windows, activeInstanceId, focusWindow } = useWindowStore();
  const { dockCollapsed } = useDockStore();
  const { layout } = useSphereStore();
  const [showPreview, setShowPreview] = useState(false);
  const app = APP_REGISTRY[appId];
  
  if (!app) return null;

  const appWindows = windows.filter(w => w.appId === appId);
  const isOpen = appWindows.length > 0;
  const isActive = windows.some(w => w.appId === appId && w.instanceId === activeInstanceId);
  const isUnity = layout === DesktopLayout.UNITY;

  return (
    <div 
      className="relative group flex items-center justify-center w-full"
      onMouseEnter={() => isOpen && setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Active Indicator Logic - Positioned outside the icon - White Color */}
      {isOpen && (
        isUnity ? (
          <div className={`absolute left-[-2px] w-1 transition-all duration-500 rounded-r-full z-10 ${isActive ? 'h-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'h-2 bg-white/20'}`} />
        ) : (
          <div className={`absolute -bottom-2 h-1 transition-all duration-500 rounded-full z-10 ${isActive ? 'w-3 bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'w-1.5 bg-white/20'}`} />
        )
      )}
      
      <button 
        onClick={() => openWindow(appId)}
        className={`
          relative transition-all duration-300 shadow-xl overflow-hidden rounded-full
          ${isUnity ? 'w-10 h-10' : 'w-10 h-10'}
          ${isActive ? 'ring-2 ring-white/30 brightness-110' : 'opacity-90 hover:opacity-100 hover:scale-105'}
          ${app.iconImage ? 'bg-black' : `bg-gradient-to-br ${app.gradient} ${isUnity ? 'p-2.5' : 'p-2'}`}
        `}
      >
        {app.iconImage ? (
          <img src={app.iconImage} className="w-full h-full object-cover" alt={app.title} />
        ) : (
          <app.icon 
            size={isUnity ? 20 : 18} 
            className="text-white drop-shadow-md mx-auto" 
          />
        )}
      </button>

      {/* Hover Preview Popover */}
      {showPreview && !dockCollapsed && (
        <div className={`absolute px-4 py-4 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl z-[1001] shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isUnity ? 'left-20' : 'bottom-20'}`}>
          <div className="text-xs font-bold text-white mb-3 border-b border-white/5 pb-2">
            {app.title} — {appWindows.length} Instance{appWindows.length > 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            {appWindows.map(win => (
              <div 
                key={win.instanceId}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow(win.instanceId);
                  setShowPreview(false);
                }}
                className="w-40 aspect-video bg-[#050505]/80 rounded-xl overflow-hidden border border-white/10 relative group/win shadow-xl flex flex-col cursor-pointer hover:scale-105 transition-transform"
              >
                {/* Miniature Title Bar */}
                <div className="h-4 bg-white/[0.05] border-b border-white/10 flex items-center px-2 gap-1.5">
                   <div className={`w-1 h-1 rounded-full ${win.isMinimized ? 'bg-zinc-600' : 'bg-blue-600'}`} />
                   <app.icon size={8} className="text-zinc-500" />
                   <span className="text-[10px] font-medium text-zinc-500 truncate">{win.title}</span>
                </div>
                {/* Miniature Body */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent">
                   <app.icon size={24} className="text-zinc-800 opacity-20 group-hover/win:opacity-40 transition-opacity" />
                </div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/win:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!dockCollapsed && !showPreview && (
        <div className={`absolute px-3 py-2 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[1001] shadow-2xl ${isUnity ? 'left-16 translate-x-4 group-hover:translate-x-0' : 'bottom-16 -translate-y-4 group-hover:translate-y-0'}`}>
          {app.title}
        </div>
      )}
    </div>
  );
};
