
import React, { useRef } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { useOSStore } from '../../store/osStore';
import { useDockStore } from '../../store/dockStore';

export const MobileNavBar: React.FC = () => {
  const { minimizeAll } = useWindowStore();
  const { closeAllDockPanels } = useDockStore();
  const { setSwitcherOpen, switcherOpen, closeAllOSPanels } = useOSStore();
  
  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isSwitcherTriggeredRef = useRef<boolean>(false);
  const holdTimerRef = useRef<number | undefined>(undefined);

  const goHome = () => {
    // If switcher is open, close it (return to desktop)
    if (switcherOpen) {
      setSwitcherOpen(false);
    } else {
      // Otherwise minimize all apps and close overlays
      minimizeAll();
      closeAllOSPanels();
      closeAllDockPanels();
    }
  };

  const handleStart = (clientY: number) => {
    startYRef.current = clientY;
    currentYRef.current = clientY;
    startTimeRef.current = Date.now();
    isSwitcherTriggeredRef.current = false;

    // Clear any existing timer
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    // Start Hold Timer for "Pause in center" to trigger Switcher
    holdTimerRef.current = window.setTimeout(() => {
      // Must still be holding (startY not null)
      if (startYRef.current !== null && currentYRef.current !== null) {
        const diff = startYRef.current - currentYRef.current;
        // Check if dragged up significantly (e.g., > 60px) and held
        if (diff > 60) {
          setSwitcherOpen(true);
          isSwitcherTriggeredRef.current = true;
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate(50);
        }
      }
    }, 300); // 300ms hold triggers switcher
  };

  const handleMove = (clientY: number) => {
    currentYRef.current = clientY;
  };

  const handleEnd = (clientY: number) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    // If switcher was triggered by the hold timer, stop here (user just released the hold)
    if (isSwitcherTriggeredRef.current) {
        startYRef.current = null;
        return;
    }

    if (startYRef.current === null) return;

    const diff = startYRef.current - clientY; // Positive = Swipe Up
    const timeDiff = Date.now() - startTimeRef.current;

    // Logic Decision Tree
    if (diff > 40) {
        // It was a swipe up
        if (timeDiff < 250) {
            // Fast/Rapid swipe -> Go Home
            goHome();
        } else {
            // Slow drag but released before hold timer triggered -> Open Switcher
            setSwitcherOpen(true);
        }
    } else {
        // Tapped or negligible drag -> Go Home (Standard Home Button behavior)
        goHome();
    }

    startYRef.current = null;
    currentYRef.current = null;
    isSwitcherTriggeredRef.current = false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-[9999] flex items-center justify-center pointer-events-none pb-2">
      {/* Invisible larger hit area for easier grabbing */}
      <div 
        className="w-48 h-10 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientY)}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientY)}
        onMouseUp={(e) => handleEnd(e.clientY)}
      >
        {/* Visible Gesture Pill */}
        <div className="w-32 h-1.5 bg-white/80 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all active:scale-x-90 active:scale-y-110 duration-200" />
      </div>
    </div>
  );
};
