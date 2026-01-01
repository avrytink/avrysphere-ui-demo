
import React, { useMemo } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { useOSStore } from '../../store/osStore';
import { AppId } from '../../types';
import { PINNED_APPS } from '../momentDock/Constants';
import { AppIcon } from '../momentDock/AppIcon';

export const TabletDock: React.FC = () => {
  const { windows, activeWorkspaceId } = useWindowStore();
  const { theme } = useOSStore();

  const isDark = theme === 'dark';

  // Styles
  const dockBg = isDark ? 'bg-black/40 border-white/10' : 'bg-white/60 border-white/40';
  const separatorColor = isDark ? 'bg-white/10' : 'bg-black/10';

  // Determine if we should show the dock
  // Show only if NO windows are open, OR all open windows are minimized (Home Screen state)
  const showDock = useMemo(() => {
    const activeWorkspaceWindows = windows.filter(w => w.workspaceId === activeWorkspaceId);
    return activeWorkspaceWindows.length === 0 || activeWorkspaceWindows.every(w => w.isMinimized);
  }, [windows, activeWorkspaceId]);

  const runningUnpinnedApps = useMemo(() => {
    const seen = new Set<AppId>(PINNED_APPS);
    const list: AppId[] = [];
    
    // Only show unpinned apps that are running in current workspace
    // Reverse to show most recently opened on right
    [...windows].reverse().forEach(w => {
      if (!seen.has(w.appId) && w.workspaceId === activeWorkspaceId && w.isOpen) {
        seen.add(w.appId);
        list.push(w.appId);
      }
    });
    return list.slice(0, 3); // Max 3 recent
  }, [windows, activeWorkspaceId]);

  return (
    <div 
      className={`
        fixed left-1/2 -translate-x-1/2 z-[1000] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${showDock ? 'bottom-4 translate-y-0 opacity-100' : '-bottom-32 translate-y-full opacity-0 pointer-events-none'}
      `}
    >
      <div className={`h-24 backdrop-blur-3xl border rounded-[2rem] flex items-center px-5 gap-4 shadow-2xl transition-all ${dockBg} hover:shadow-3xl`}>
        
        {/* Favorites */}
        <div className="flex items-center gap-4">
            {PINNED_APPS.map(appId => (
                <div key={appId} className="w-14 h-14 flex items-center justify-center transition-transform hover:-translate-y-2 duration-300">
                    <AppIcon appId={appId} />
                </div>
            ))}
        </div>

        {/* Separator */}
        {runningUnpinnedApps.length > 0 && (
            <div className={`w-px h-10 ${separatorColor} mx-1`} />
        )}

        {/* Running / Recent */}
        {runningUnpinnedApps.length > 0 && (
            <div className="flex items-center gap-4">
                {runningUnpinnedApps.map(appId => (
                    <div key={appId} className="w-14 h-14 flex items-center justify-center transition-transform hover:-translate-y-2 duration-300">
                        <AppIcon appId={appId} />
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};
