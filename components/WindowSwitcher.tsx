
import React, { useEffect, useMemo } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useOSStore } from '../store/osStore';
import { useSphereStore } from '../store/sphereStore';
import { APP_REGISTRY } from '../registry/AppRegistry';
import { WindowPreview } from './WindowPreview';
import { X } from 'lucide-react';

export const WindowSwitcher: React.FC = () => {
  const { switcherOpen, switcherIndex, setSwitcherOpen, setSwitcherIndex, theme } = useOSStore();
  const { isMobile } = useSphereStore();
  const { windows, focusWindow, activeWorkspaceId, closeWindow } = useWindowStore();

  const currentWorkspaceWindows = useMemo(() => 
    windows.filter(w => w.workspaceId === activeWorkspaceId && !w.isMinimized),
    [windows, activeWorkspaceId]
  );

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!switcherOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSwitcherIndex((switcherIndex + 1) % currentWorkspaceWindows.length);
      if (e.key === 'ArrowLeft') setSwitcherIndex((switcherIndex - 1 + currentWorkspaceWindows.length) % currentWorkspaceWindows.length);
      if (e.key === 'Enter') {
        if (currentWorkspaceWindows[switcherIndex]) focusWindow(currentWorkspaceWindows[switcherIndex].instanceId);
        setSwitcherOpen(false);
      }
      if (e.key === 'Escape') setSwitcherOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switcherOpen, switcherIndex, currentWorkspaceWindows, focusWindow, setSwitcherOpen, setSwitcherIndex]);

  useEffect(() => {
    if (isMobile) return; 
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (!switcherOpen) {
          setSwitcherOpen(true);
          setSwitcherIndex(0);
        } else {
          setSwitcherIndex((switcherIndex + 1) % currentWorkspaceWindows.length);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey && switcherOpen) {
        if (currentWorkspaceWindows[switcherIndex]) focusWindow(currentWorkspaceWindows[switcherIndex].instanceId);
        setSwitcherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [switcherOpen, switcherIndex, currentWorkspaceWindows, focusWindow, setSwitcherOpen, setSwitcherIndex, isMobile]);

  if (!switcherOpen || currentWorkspaceWindows.length === 0) return null;

  return (
    <div className={`fixed inset-0 z-[4000] flex items-center justify-center backdrop-blur-3xl ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
      <div className="flex gap-10 p-12 overflow-x-auto no-scrollbar max-w-[95vw] items-center animate-in zoom-in-95 duration-200">
        {currentWorkspaceWindows.map((win, i) => {
          const isSelected = switcherIndex === i;
          
          return (
            <WindowPreview
              key={win.instanceId}
              win={win}
              isDark={isDark}
              isActive={isSelected}
              className={`
                w-72 h-56 transition-all duration-300 cursor-pointer shadow-2xl
                ${isSelected 
                  ? 'scale-110 ring-4 ring-blue-500 ring-offset-4 ring-offset-transparent z-10' 
                  : 'opacity-40 scale-90 grayscale hover:grayscale-0 hover:opacity-80'}
              `}
              onClick={() => { focusWindow(win.instanceId); setSwitcherOpen(false); }}
            />
          );
        })}
      </div>
    </div>
  );
};
