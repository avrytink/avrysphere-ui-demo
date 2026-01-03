
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useOSStore } from '../store/osStore';
import { useSphereStore } from '../store/sphereStore';
import { APP_REGISTRY } from '../registry/AppRegistry';
import { WindowPreview } from './WindowPreview';
import { X } from 'lucide-react';

export const WindowSwitcher: React.FC = () => {
  const { switcherOpen, switcherIndex, setSwitcherOpen, setSwitcherIndex, theme } = useOSStore();
  const { isMobile, isTablet } = useSphereStore();
  const { windows, focusWindow, activeWorkspaceId, closeWindow } = useWindowStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const touchY = useRef<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const currentWorkspaceWindows = useMemo(() => 
    windows.filter(w => w.workspaceId === activeWorkspaceId),
    [windows, activeWorkspaceId]
  );

  const isDark = theme === 'dark';

  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    setDraggedId(id);
    touchY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedId) return;
    const diff = e.touches[0].clientY - touchY.current;
    if (diff < 0) { // Only drag upwards
      setOffsetY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (draggedId && offsetY < -150) {
      closeWindow(draggedId);
    }
    setDraggedId(null);
    setOffsetY(0);
  };

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
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (currentWorkspaceWindows[switcherIndex]) {
          closeWindow(currentWorkspaceWindows[switcherIndex].instanceId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switcherOpen, switcherIndex, currentWorkspaceWindows, focusWindow, setSwitcherOpen, setSwitcherIndex, closeWindow]);

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
      <div 
        className="flex gap-10 p-12 overflow-x-auto no-scrollbar max-w-[95vw] items-center animate-in zoom-in-95 duration-200"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentWorkspaceWindows.map((win, i) => {
          const isSelected = switcherIndex === i;
          const isDragging = draggedId === win.instanceId;
          
          return (
            <div
              key={win.instanceId}
              className="relative transition-transform duration-200"
              style={{ 
                transform: isDragging ? `translateY(${offsetY}px)` : 'none',
                opacity: isDragging ? Math.max(0, 1 + offsetY / 300) : 1
              }}
              onTouchStart={(e) => handleTouchStart(win.instanceId, e)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(win.instanceId); }}
                className={`absolute -top-4 -right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity ${isSelected || isMobile || isTablet ? 'opacity-100' : ''}`}
              >
                <X size={16} strokeWidth={3} />
              </button>
              
              <WindowPreview
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
              <div className="mt-4 text-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {win.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
