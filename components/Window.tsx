import React, {
  createContext,
  useContext,
  useMemo,
  memo,
} from "react";
import { Rnd } from "react-rnd";
import { useWindowStore } from "../store/windowStore";
import { useOSStore } from "../store/osStore";
import { useSphereStore } from "../store/sphereStore";
import { useDockStore } from "../store/dockStore";
import { WindowState, DesktopLayout, AppId, SnapType } from "../types";
import { APP_REGISTRY } from "../registry/AppRegistry";
import { WindowHeader } from "./WindowHeader";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowContext = createContext<WindowState | null>(null);
export const useWindow = () => useContext(WindowContext);

export const useTheme = () => {
  const windowContext = useWindow();
  const systemTheme = useOSStore(state => state.theme);
  return windowContext?.theme || systemTheme;
};

// --- Optimized Window Content ---
const WindowContent = memo(({ children, win, isFloating }: { children: React.ReactNode, win: WindowState, isFloating?: boolean }) => {
  return (
    <div className={`flex-1 overflow-hidden relative z-[10] ${
      win.isMaximized ? "rounded-none" : isFloating ? "rounded-[1.25rem]" : "rounded-b-[1.25rem]"
    }`}>
      <WindowContext.Provider value={win}>
        {children}
      </WindowContext.Provider>
    </div>
  );
});

// --- Window Component ---

export const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const updateWindowPosition = useWindowStore(state => state.updateWindowPosition);
  const updateWindowSize = useWindowStore(state => state.updateWindowSize);
  const updateWindowPreview = useWindowStore(state => state.updateWindowPreview);
  const focusWindow = useWindowStore(state => state.focusWindow);
  const activeInstanceId = useWindowStore(state => state.activeInstanceId);
  const snapPreview = useWindowStore(state => state.snapPreview);

  const systemTheme = useOSStore(state => state.theme);
  const layout = useSphereStore(state => state.layout);
  const isGaming = useSphereStore(state => state.isGaming);
  const isTV = useSphereStore(state => state.isTV);
  const dockCollapsed = useDockStore(state => state.dockCollapsed);
  
  const contentRef = React.useRef<HTMLDivElement>(null);

  const isActive = activeInstanceId === win.instanceId;
  const app = APP_REGISTRY[win.appId];

  // Capture Preview Logic
  const capturePreview = React.useCallback(async () => {
    if (!contentRef.current || win.isMinimized) return;
    try {
      // Dynamic import to avoid SSR issues if any (though this is SPA)
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(contentRef.current, {
        logging: false,
        useCORS: true,
        scale: 0.5, // Capture at lower res for performance
        backgroundColor: null, // Transparent background
      });
      const dataUrl = canvas.toDataURL("image/png");
      updateWindowPreview(win.instanceId, dataUrl);
    } catch (e) {
      console.error("Failed to capture window preview", e);
    }
  }, [win.instanceId, win.isMinimized, updateWindowPreview]);

  // Capture on Blur (Active -> Inactive)
  React.useEffect(() => {
    if (!isActive) {
      capturePreview();
    }
  }, [isActive, capturePreview]);

  // Periodic capture for active window (every 5s)
  React.useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(capturePreview, 5000);
    return () => clearInterval(interval);
  }, [isActive, capturePreview]);

  // Use app-specific theme if set, otherwise follow system
  const effectiveTheme = win.theme || systemTheme;
  const isDark = effectiveTheme === "dark";

  const isVideoPlayer = win.appId === AppId.VIDEO_PLAYER;
  const isHeadless = app?.headless || isGaming || isTV;

  const windowBg = isDark ? "bg-[#0a0a0a]/95" : "bg-white/95";
  const borderColor =
    isVideoPlayer || isHeadless
      ? "border-none"
      : isDark
      ? "border-white/10"
      : "border-black/10";
  const activeBorder =
    isVideoPlayer || isHeadless
      ? ""
      : isDark
      ? "border-white/30 ring-white/5"
      : "border-black/20 ring-black/5";

  const DOCK_WIDTH =
    layout === DesktopLayout.UNITY ? (dockCollapsed ? 48 : 80) : 0;
  const TOP_BAR_HEIGHT = 32;
  const topPositionY = layout === DesktopLayout.UNITY ? 0 : TOP_BAR_HEIGHT - 8;

  const ghostStyles = useMemo(() => {
    if (!snapPreview || snapPreview.instanceId !== win.instanceId) return null;
    
    const usableW = window.innerWidth - DOCK_WIDTH;
    const usableH = window.innerHeight - (layout === DesktopLayout.UNITY ? 0 : TOP_BAR_HEIGHT);
    const halfW = usableW / 2;
    const halfH = usableH / 2;
    const thirdW = usableW / 3;
    const twoThirdsW = usableW * (2 / 3);

    let styles: React.CSSProperties = {
      top: topPositionY,
      left: DOCK_WIDTH,
      width: "100%",
      height: "100%",
    };

    switch (snapPreview.type) {
      case SnapType.FULL:
        styles = { ...styles, width: usableW, height: usableH };
        break;
      case SnapType.LEFT:
        styles = { ...styles, width: halfW, height: usableH };
        break;
      case SnapType.RIGHT:
        styles = { ...styles, left: DOCK_WIDTH + halfW, width: halfW, height: usableH };
        break;
      case SnapType.TOP_LEFT:
        styles = { ...styles, width: halfW, height: halfH };
        break;
      case SnapType.TOP_RIGHT:
        styles = { ...styles, left: DOCK_WIDTH + halfW, width: halfW, height: halfH };
        break;
      case SnapType.BOTTOM_LEFT:
        styles = { ...styles, top: topPositionY + halfH, width: halfW, height: halfH };
        break;
      case SnapType.BOTTOM_RIGHT:
        styles = { ...styles, top: topPositionY + halfH, left: DOCK_WIDTH + halfW, width: halfW, height: halfH };
        break;
      case SnapType.LEFT_TWO_THIRDS:
        styles = { ...styles, width: twoThirdsW, height: usableH };
        break;
      case SnapType.RIGHT_ONE_THIRD:
        styles = { ...styles, left: DOCK_WIDTH + twoThirdsW, width: thirdW, height: usableH };
        break;
      case SnapType.THIRD_LEFT:
        styles = { ...styles, width: thirdW, height: usableH };
        break;
      case SnapType.THIRD_CENTER:
        styles = { ...styles, left: DOCK_WIDTH + thirdW, width: thirdW, height: usableH };
        break;
      case SnapType.THIRD_RIGHT:
        styles = { ...styles, left: DOCK_WIDTH + thirdW * 2, width: thirdW, height: usableH };
        break;
      case SnapType.COL3_L25:
        styles = { ...styles, width: usableW * 0.25, height: usableH };
        break;
      case SnapType.COL3_C50:
        styles = { ...styles, left: DOCK_WIDTH + usableW * 0.25, width: usableW * 0.5, height: usableH };
        break;
      case SnapType.COL3_R25:
        styles = { ...styles, left: DOCK_WIDTH + usableW * 0.75, width: usableW * 0.25, height: usableH };
        break;
    }
    return styles;
  }, [snapPreview, win.instanceId, DOCK_WIDTH, layout, topPositionY]);

  if (win.isMinimized) return null;

  // Render headless/fullscreen directly without Rnd or frames
  if (isHeadless) {
    return <WindowContext.Provider value={win}>{children}</WindowContext.Provider>;
  }

  return (
    <>
      {ghostStyles && (
        <div
          className="fixed z-[9000] pointer-events-none transition-all duration-300 ease-out backdrop-blur-xl border-2 rounded-2xl shadow-2xl bg-blue-500/10 border-blue-500/40"
          style={ghostStyles}
        />
      )}

      <Rnd
        size={{ width: win.width, height: win.height }}
        position={{ x: win.x, y: win.y }}
        onDragStop={(e, d) => {
          if (!win.isMaximized) {
             updateWindowPosition(win.instanceId, d.x, d.y);
             capturePreview();
          }
        }}
        onResizeStop={(e, dir, ref, delta, pos) => {
          if (!win.isMaximized) {
            updateWindowSize(win.instanceId, ref.style.width, ref.style.height);
            updateWindowPosition(win.instanceId, pos.x, pos.y);
            capturePreview();
          }
        }}
        dragHandleClassName="window-handle"
        bounds="parent"
        enableResizing={!win.isMaximized}
        disableDragging={win.isMaximized}
        style={{ zIndex: win.zIndex, willChange: "transform" }}
        className={`pointer-events-auto transition-transform duration-100 ease-out`}
        onMouseDown={(e) => {
          if (!isActive) focusWindow(win.instanceId);
        }}
      >
        <div 
          ref={contentRef} 
          className={`flex flex-col w-full h-full relative overflow-visible backdrop-blur-3xl border transition-all duration-300 shadow-2xl ${
            win.isMaximized ? "rounded-none" : "rounded-[1.25rem]"
          } ${
            isVideoPlayer ? "bg-black" : windowBg
          } ${borderColor} ${isActive ? activeBorder : "opacity-95"}`}
        >
          {/* Standard Header */}
          {!app?.floatingHeader && (
            <WindowHeader win={win} isDark={isDark} isActive={isActive} />
          )}

          <WindowContent win={win} isFloating={app?.floatingHeader}>
            {children}
          </WindowContent>

          {/* Floating Header Overlay */}
          {app?.floatingHeader && (
             <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
                <WindowHeader win={win} isDark={isDark} isActive={isActive} isFloating={true} />
             </div>
          )}
        </div>
      </Rnd>
    </>
  );
};
