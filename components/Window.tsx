
import React, { useState, useMemo, createContext, useContext, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { useWindowStore } from '../store/windowStore';
import { useOSStore } from '../store/osStore';
import { useSphereStore } from '../store/sphereStore';
import { useDockStore } from '../store/dockStore';
import { WindowState, SnapType, DesktopLayout, AppId } from '../types';
import { APP_REGISTRY } from '../registry/AppRegistry';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowContext = createContext<WindowState | null>(null);
export const useWindow = () => useContext(WindowContext);

export const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const { 
    windows, closeWindow, minimizeWindow, maximizeWindow, snapWindow,
    focusWindow, updateWindowPosition, updateWindowSize,
    activeInstanceId
  } = useWindowStore();

  const { theme } = useOSStore();
  const { layout } = useSphereStore();
  const { dockCollapsed } = useDockStore();

  const [snapPreview, setSnapPreview] = useState<SnapType>(SnapType.NONE);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const [isHoveringActions, setIsHoveringActions] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  
  const snapMenuTimerRef = useRef<number | null>(null);
  const maxBtnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isActive = activeInstanceId === win.instanceId;
  const app = APP_REGISTRY[win.appId];
  const isDark = theme === 'dark';
  const isVideoPlayer = win.appId === AppId.VIDEO_PLAYER;

  const windowBg = isDark ? 'bg-[#0a0a0a]/95' : 'bg-white/95';
  const borderColor = isVideoPlayer ? 'border-none' : (isDark ? 'border-white/10' : 'border-black/10');
  const activeBorder = isVideoPlayer ? '' : (isDark ? 'border-white/30 ring-white/5' : 'border-black/20 ring-black/5');
  const textColor = isDark || isVideoPlayer ? 'text-zinc-100' : 'text-zinc-900';
  const mutedText = isDark || isVideoPlayer ? 'text-zinc-400' : 'text-zinc-500';

  // Handle menu positioning and global click-to-close
  useLayoutEffect(() => {
    if (showSnapMenu && maxBtnRef.current) {
      const rect = maxBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.right - 320 // Align menu to right of button
      });

      const handleGlobalClick = (e: MouseEvent) => {
        if (maxBtnRef.current && !maxBtnRef.current.contains(e.target as Node)) {
          setShowSnapMenu(false);
        }
      };

      window.addEventListener('mousedown', handleGlobalClick);
      return () => window.removeEventListener('mousedown', handleGlobalClick);
    }
  }, [showSnapMenu]);

  const ghostStyles = useMemo(() => {
    if (snapPreview === SnapType.NONE) return null;
    const dockWidth = layout === DesktopLayout.UNITY ? (dockCollapsed ? 48 : 80) : 0;
    const usableW = window.innerWidth - dockWidth;
    const usableH = window.innerHeight - 32;
    const halfW = usableW / 2;
    const halfH = usableH / 2;
    const thirdW = usableW / 3;
    const twoThirdsW = usableW * (2/3);

    switch (snapPreview) {
      case SnapType.FULL: return { top: 32, left: dockWidth, width: usableW, height: usableH };
      case SnapType.LEFT: return { top: 32, left: dockWidth, width: halfW, height: usableH };
      case SnapType.RIGHT: return { top: 32, left: dockWidth + halfW, width: halfW, height: usableH };
      case SnapType.TOP_LEFT: return { top: 32, left: dockWidth, width: halfW, height: halfH };
      case SnapType.TOP_RIGHT: return { top: 32, left: dockWidth + halfW, width: halfW, height: halfH };
      case SnapType.BOTTOM_LEFT: return { top: 32 + halfH, left: dockWidth, width: halfW, height: halfH };
      case SnapType.BOTTOM_RIGHT: return { top: 32 + halfH, left: dockWidth + halfW, width: halfW, height: halfH };
      case SnapType.LEFT_TWO_THIRDS: return { top: 32, left: dockWidth, width: twoThirdsW, height: usableH };
      case SnapType.RIGHT_ONE_THIRD: return { top: 32, left: dockWidth + twoThirdsW, width: thirdW, height: usableH };
      case SnapType.THIRD_LEFT: return { top: 32, left: dockWidth, width: thirdW, height: usableH };
      case SnapType.THIRD_CENTER: return { top: 32, left: dockWidth + thirdW, width: thirdW, height: usableH };
      case SnapType.THIRD_RIGHT: return { top: 32, left: dockWidth + (thirdW * 2), width: thirdW, height: usableH };
      case SnapType.RIGHT_TOP_QUARTER: return { top: 32, left: dockWidth + halfW, width: halfW, height: halfH };
      case SnapType.RIGHT_BOTTOM_QUARTER: return { top: 32 + halfH, left: dockWidth + halfW, width: halfW, height: halfH };
      case SnapType.COL3_L25: return { top: 32, left: dockWidth, width: usableW * 0.25, height: usableH };
      case SnapType.COL3_C50: return { top: 32, left: dockWidth + (usableW * 0.25), width: usableW * 0.5, height: usableH };
      case SnapType.COL3_R25: return { top: 32, left: dockWidth + (usableW * 0.75), width: usableW * 0.25, height: usableH };
      default: return null;
    }
  }, [snapPreview, layout, dockCollapsed]);

  const patterns = [
    { 
      id: 'split', 
      panes: [
        { type: SnapType.LEFT, style: { width: '50%', height: '100%', left: 0 } },
        { type: SnapType.RIGHT, style: { width: '50%', height: '100%', right: 0 } }
      ]
    },
    { 
      id: 'split-2-1', 
      panes: [
        { type: SnapType.LEFT_TWO_THIRDS, style: { width: '66%', height: '100%', left: 0 } },
        { type: SnapType.RIGHT_ONE_THIRD, style: { width: '33%', height: '100%', right: 0 } }
      ]
    },
    { 
      id: 'thirds', 
      panes: [
        { type: SnapType.THIRD_LEFT, style: { width: '32%', height: '100%', left: 0 } },
        { type: SnapType.THIRD_CENTER, style: { width: '33%', height: '100%', left: '33.5%' } },
        { type: SnapType.THIRD_RIGHT, style: { width: '32%', height: '100%', right: 0 } }
      ]
    },
    { 
      id: 'side-split', 
      panes: [
        { type: SnapType.LEFT, style: { width: '49%', height: '100%', left: 0 } },
        { type: SnapType.RIGHT_TOP_QUARTER, style: { width: '49%', height: '49%', top: 0, right: 0 } },
        { type: SnapType.RIGHT_BOTTOM_QUARTER, style: { width: '49%', height: '49%', bottom: 0, right: 0 } }
      ]
    },
    { 
      id: 'grid', 
      panes: [
        { type: SnapType.TOP_LEFT, style: { width: '49%', height: '49%', top: 0, left: 0 } },
        { type: SnapType.TOP_RIGHT, style: { width: '49%', height: '49%', top: 0, right: 0 } },
        { type: SnapType.BOTTOM_LEFT, style: { width: '49%', height: '49%', bottom: 0, left: 0 } },
        { type: SnapType.BOTTOM_RIGHT, style: { width: '49%', height: '49%', bottom: 0, right: 0 } }
      ]
    },
    { 
      id: 'center-focus', 
      panes: [
        { type: SnapType.COL3_L25, style: { width: '24%', height: '100%', left: 0 } },
        { type: SnapType.COL3_C50, style: { width: '50%', height: '100%', left: '25%' } },
        { type: SnapType.COL3_R25, style: { width: '24%', height: '100%', right: 0 } }
      ]
    }
  ];

  const handleMaxMouseEnter = () => {
    snapMenuTimerRef.current = window.setTimeout(() => setShowSnapMenu(true), 600);
  };

  const handleMaxMouseLeave = () => {
    if (snapMenuTimerRef.current) clearTimeout(snapMenuTimerRef.current);
  };

  if (win.isMinimized) return null;

  return (
    <>
      {snapPreview !== SnapType.NONE && (
        <div className="fixed z-[9000] pointer-events-none transition-all duration-300 ease-out backdrop-blur-xl border-2 rounded-2xl shadow-2xl bg-blue-500/10 border-blue-500/40" style={{ ...ghostStyles }} />
      )}
      
      <Rnd
        size={{ width: win.width, height: win.height }}
        position={{ x: win.x, y: win.y }}
        onDragStop={(e, d) => !win.isMaximized && updateWindowPosition(win.instanceId, d.x, d.y)}
        onResizeStop={(e, dir, ref, delta, pos) => { if (!win.isMaximized) { updateWindowSize(win.instanceId, ref.style.width, ref.style.height); updateWindowPosition(win.instanceId, pos.x, pos.y); } }}
        dragHandleClassName="window-handle"
        bounds="parent"
        enableResizing={!win.isMaximized}
        disableDragging={win.isMaximized}
        style={{ zIndex: win.zIndex }}
        className={`flex flex-col backdrop-blur-3xl border transition-all duration-500 rounded-[1.25rem] shadow-2xl group ${isVideoPlayer ? 'bg-black' : windowBg} ${borderColor} ${isActive ? activeBorder : 'opacity-95'}`}
        onMouseDown={() => !isActive && focusWindow(win.instanceId)}
      >
        <div className="flex flex-col w-full h-full relative rounded-[1.25rem] overflow-visible">
            <div className={`py-2 flex items-center justify-between px-2 shrink-0 rounded-t-[1.25rem] border-b backdrop-blur-xl z-[20] ${isActive ? (isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/5') : (isDark ? 'bg-transparent border-white/5' : 'bg-transparent border-black/5')}`}>
              
              <div className="window-handle flex-1 h-full flex items-center gap-3" onDoubleClick={() => maximizeWindow(win.instanceId)}>
                {!isVideoPlayer && app && (
                  <>
                    <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg shrink-0 ${app.gradient}`}>
                       <app.icon size={14} className="text-white" />
                    </div>
                    <span className={`text-[13px] font-bold transition-colors ${isActive ? textColor : mutedText}`}>{win.title}</span>
                  </>
                )}
              </div>

              <div 
                className={`flex items-center gap-1.5 px-3 h-[30px] rounded-full transition-all duration-500 relative z-[100] mt-[1px] ${isHoveringActions ? 'bg-transparent' : (isDark ? 'bg-white/10' : 'bg-black/10')}`}
                onMouseEnter={() => setIsHoveringActions(true)}
                onMouseLeave={() => setIsHoveringActions(false)}
                onMouseDown={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => minimizeWindow(win.instanceId)} 
                  className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${isHoveringActions ? 'w-7 h-7 bg-white/10 hover:bg-white/20' : 'w-2 h-2 bg-white/40'}`}
                >
                  <Minus 
                    size={10} 
                    className={`transition-opacity duration-300 ${isHoveringActions ? 'opacity-100' : 'opacity-0'} ${isDark ? 'text-white' : 'text-black'}`} 
                    strokeWidth={3}
                  />
                </button>

                <div className="relative flex items-center h-full">
                  <button 
                    ref={maxBtnRef}
                    onClick={() => maximizeWindow(win.instanceId)} 
                    onMouseEnter={handleMaxMouseEnter}
                    onMouseLeave={handleMaxMouseLeave}
                    onContextMenu={(e) => { e.preventDefault(); setShowSnapMenu(!showSnapMenu); }}
                    className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${isHoveringActions || showSnapMenu ? 'w-7 h-7 bg-white/10 hover:bg-white/20' : 'w-2 h-2 bg-white/40'}`}
                  >
                    <Square 
                      size={8} 
                      className={`transition-opacity duration-300 ${isHoveringActions || showSnapMenu ? 'opacity-100' : 'opacity-0'} ${isDark ? 'text-white' : 'text-black'}`} 
                      strokeWidth={3}
                    />
                  </button>

                  {showSnapMenu && createPortal(
                    <div 
                      className={`fixed p-4 rounded-xl border shadow-2xl backdrop-blur-3xl z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 bg-[#1e232a]/95 border-white/10 w-[320px]`}
                      style={{ top: menuPos.top, left: menuPos.left }}
                      onMouseEnter={() => { if(snapMenuTimerRef.current) clearTimeout(snapMenuTimerRef.current); }}
                      onMouseLeave={() => setShowSnapMenu(false)}
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {patterns.map((p) => (
                          <div key={p.id} className="aspect-[4/3] relative flex gap-1">
                            {p.panes.map((pane, idx) => (
                              <button 
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  snapWindow(win.instanceId, pane.type); 
                                  setShowSnapMenu(false); 
                                  setSnapPreview(SnapType.NONE);
                                }}
                                onMouseEnter={() => setSnapPreview(pane.type)}
                                onMouseLeave={() => setSnapPreview(SnapType.NONE)}
                                className="absolute border-[0.5px] border-white/20 bg-white/5 rounded-sm hover:border-white hover:border-[1.5px] transition-all z-10"
                                style={pane.style}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>,
                    document.body
                  )}
                </div>

                <button 
                  onClick={() => closeWindow(win.instanceId)} 
                  className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${isHoveringActions ? 'w-7 h-7 bg-white/10 hover:bg-red-500' : 'w-2 h-2 bg-white/40'}`}
                >
                  <X 
                    size={10} 
                    className={`transition-opacity duration-300 ${isHoveringActions ? 'opacity-100 text-white' : 'opacity-0'}`} 
                    strokeWidth={3}
                  />
                </button>
              </div>
            </div>

            <div ref={contentRef} className="flex-1 overflow-hidden relative rounded-b-[1.25rem] z-[10]">
              <WindowContext.Provider value={win}>{children}</WindowContext.Provider>
            </div>
        </div>
      </Rnd>
    </>
  );
};
