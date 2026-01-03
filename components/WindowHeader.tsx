import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Square, Moon, Sun, Monitor } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { useSphereStore } from "../store/sphereStore";
import { WindowState, SnapType, AppId } from "../types";
import { APP_REGISTRY } from "../registry/AppRegistry";

// --- WindowActions Component ---

export const WindowActions: React.FC<{
  win: WindowState;
  isDark: boolean;
  isActive: boolean;
}> = ({ win, isDark, isActive }) => {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const snapWindow = useWindowStore((state) => state.snapWindow);
  const setSnapPreview = useWindowStore((state) => state.setSnapPreview);

  const [isHoveringActions, setIsHoveringActions] = useState(false);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const snapMenuTimerRef = useRef<number | null>(null);
  const maxBtnRef = useRef<HTMLButtonElement>(null);

  const handleMaxMouseEnter = () => {
    snapMenuTimerRef.current = window.setTimeout(
      () => setShowSnapMenu(true),
      600
    );
  };

  const handleMaxMouseLeave = () => {
    if (snapMenuTimerRef.current) clearTimeout(snapMenuTimerRef.current);
  };

  useLayoutEffect(() => {
    if (showSnapMenu && maxBtnRef.current) {
      const rect = maxBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        left: rect.right - 320,
      });

      const handleGlobalClick = (e: MouseEvent) => {
        if (
          maxBtnRef.current &&
          !maxBtnRef.current.contains(e.target as Node)
        ) {
          setShowSnapMenu(false);
        }
      };

      window.addEventListener("mousedown", handleGlobalClick);
      return () => window.removeEventListener("mousedown", handleGlobalClick);
    }
  }, [showSnapMenu]);

  const patterns = [
    {
      id: "split",
      panes: [
        {
          type: SnapType.LEFT,
          style: { width: "50%", height: "100%", left: 0 },
        },
        {
          type: SnapType.RIGHT,
          style: { width: "50%", height: "100%", right: 0 },
        },
      ],
    },
    {
      id: "split-2-1",
      panes: [
        {
          type: SnapType.LEFT_TWO_THIRDS,
          style: { width: "66%", height: "100%", left: 0 },
        },
        {
          type: SnapType.RIGHT_ONE_THIRD,
          style: { width: "33%", height: "100%", right: 0 },
        },
      ],
    },
    {
      id: "thirds",
      panes: [
        {
          type: SnapType.THIRD_LEFT,
          style: { width: "32%", height: "100%", left: 0 },
        },
        {
          type: SnapType.THIRD_CENTER,
          style: { width: "33%", height: "100%", left: "33.5%" },
        },
        {
          type: SnapType.THIRD_RIGHT,
          style: { width: "32%", height: "100%", right: 0 },
        },
      ],
    },
    {
      id: "side-split",
      panes: [
        {
          type: SnapType.LEFT,
          style: { width: "49%", height: "100%", left: 0 },
        },
        {
          type: SnapType.RIGHT_TOP_QUARTER,
          style: { width: "49%", height: "49%", top: 0, right: 0 },
        },
        {
          type: SnapType.RIGHT_BOTTOM_QUARTER,
          style: { width: "49%", height: "49%", bottom: 0, right: 0 },
        },
      ],
    },
    {
      id: "grid",
      panes: [
        {
          type: SnapType.TOP_LEFT,
          style: { width: "49%", height: "49%", top: 0, left: 0 },
        },
        {
          type: SnapType.TOP_RIGHT,
          style: { width: "49%", height: "49%", top: 0, right: 0 },
        },
        {
          type: SnapType.BOTTOM_LEFT,
          style: { width: "49%", height: "49%", bottom: 0, left: 0 },
        },
        {
          type: SnapType.BOTTOM_RIGHT,
          style: { width: "49%", height: "49%", bottom: 0, right: 0 },
        },
      ],
    },
    {
      id: "center-focus",
      panes: [
        {
          type: SnapType.COL3_L25,
          style: { width: "24%", height: "100%", left: 0 },
        },
        {
          type: SnapType.COL3_C50,
          style: { width: "50%", height: "100%", left: "25%" },
        },
        {
          type: SnapType.COL3_R25,
          style: { width: "24%", height: "100%", right: 0 },
        },
      ],
    },
  ];

  return (
    <div
      className={`flex items-center gap-1.5 px-3 h-[30px] rounded-full transition-all duration-500 relative z-[100] mt-[1px] ${
        isHoveringActions
          ? "bg-transparent"
          : isDark
          ? "bg-white/10"
          : "bg-black/10"
      }`}
      onMouseEnter={() => setIsHoveringActions(true)}
      onMouseLeave={() => setIsHoveringActions(false)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          minimizeWindow(win.instanceId);
        }}
        className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${
          isHoveringActions
            ? `w-7 h-7 ${
                isDark
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-black/5 hover:bg-black/10"
              }`
            : `w-2 h-2 ${isDark ? "bg-white/40" : "bg-black/20"}`
        }`}
      >
        <Minus
          size={10}
          className={`transition-opacity duration-300 ${
            isHoveringActions ? "opacity-100" : "opacity-0"
          } ${isDark ? "text-white" : "text-black"}`}
          strokeWidth={3}
        />
      </button>

      <div className="relative flex items-center h-full">
        <button
          ref={maxBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            maximizeWindow(win.instanceId);
          }}
          onMouseEnter={handleMaxMouseEnter}
          onMouseLeave={handleMaxMouseLeave}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSnapMenu(!showSnapMenu);
          }}
          className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${
            isHoveringActions || showSnapMenu
              ? `w-7 h-7 ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-black/5 hover:bg-black/10"
                }`
              : `w-2 h-2 ${isDark ? "bg-white/40" : "bg-black/20"}`
          }`}
        >
          <Square
            size={8}
            className={`transition-opacity duration-300 ${
              isHoveringActions || showSnapMenu ? "opacity-100" : "opacity-0"
            } ${isDark ? "text-white" : "text-black"}`}
            strokeWidth={3}
          />
        </button>

        {showSnapMenu &&
          createPortal(
            <div
              className={`fixed p-4 rounded-xl border shadow-2xl backdrop-blur-3xl z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 bg-[#1e232a]/95 border-white/10 w-[320px]`}
              style={{ top: menuPos.top, left: menuPos.left }}
              onMouseEnter={() => {
                if (snapMenuTimerRef.current)
                  clearTimeout(snapMenuTimerRef.current);
              }}
              onMouseLeave={() => setShowSnapMenu(false)}
              onMouseDown={(e) => e.stopPropagation()}
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
                          setSnapPreview(null);
                        }}
                        onMouseEnter={() =>
                          setSnapPreview({
                            instanceId: win.instanceId,
                            type: pane.type,
                          })
                        }
                        onMouseLeave={() => setSnapPreview(null)}
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
        onClick={(e) => {
          e.stopPropagation();
          closeWindow(win.instanceId);
        }}
        className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${
          isHoveringActions
            ? `w-7 h-7 ${
                isDark ? "bg-white/10" : "bg-black/5"
              } hover:bg-red-500 hover:text-white group/close`
            : `w-2 h-2 ${isDark ? "bg-white/40" : "bg-black/20"}`
        }`}
      >
        <X
          size={10}
          className={`transition-opacity duration-300 ${
            isHoveringActions ? "opacity-100" : "opacity-0"
          } ${
            isDark ? "text-white" : "text-black group-hover/close:text-white"
          }`}
          strokeWidth={3}
        />
      </button>
    </div>
  );
};

// --- WindowHeader Component ---

export const WindowHeader: React.FC<{
  win: WindowState;
  isDark: boolean;
  isActive: boolean;
  isFloating?: boolean;
}> = ({ win, isDark, isActive, isFloating }) => {
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const setWindowTheme = useWindowStore((state) => state.setWindowTheme);
  const app = APP_REGISTRY[win.appId];
  const textColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const mutedText = isDark ? "text-zinc-400" : "text-zinc-500";
  const hoverBg = isDark ? "hover:bg-white/20" : "hover:bg-black/10";
  const glassBg = isDark ? "bg-white/10" : "bg-black/10";

  const toggleAppTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.theme === undefined) {
      setWindowTheme(win.instanceId, "light");
    } else if (win.theme === "light") {
      setWindowTheme(win.instanceId, "dark");
    } else {
      setWindowTheme(win.instanceId, undefined);
    }
  };

  return (
    <div
      className={`py-2 flex items-center justify-between px-2 shrink-0 rounded-t-[1.25rem] border-b backdrop-blur-xl z-[20] ${
        isFloating
          ? "bg-transparent border-none"
          : isActive
          ? isDark
            ? "bg-white/[0.03] border-white/10"
            : "bg-black/[0.02] border-black/5"
          : isDark
          ? "bg-transparent border-white/5"
          : "bg-transparent border-black/5"
      }`}
    >
      <div
        className="window-handle h-full flex items-center gap-3 pointer-events-auto shrink-0"
        onDoubleClick={() => maximizeWindow(win.instanceId)}
      >
        {app && !(isFloating && app.hideFloatingTitle) && (
          <>
            <div
              className={`p-1 rounded-lg flex items-center justify-center ${
                app?.iconImage
                  ? ""
                  : app?.gradient
                  ? `bg-gradient-to-br ${app.gradient}`
                  : "bg-zinc-700"
              }`}
            >
              {app?.iconImage ? (
                <img
                  src={app.iconImage}
                  className="w-4 h-4 object-cover rounded-sm"
                  alt={app.title}
                />
              ) : (
                app?.icon && <app.icon size={14} className="text-white" />
              )}
            </div>
            <span
              className={`text-[13px] transition-colors whitespace-nowrap ${
                isActive ? textColor : mutedText
              }`}
            >
              {win.title}
            </span>
          </>
        )}
      </div>

      {app?.headerComponent && (
        <div className="flex-1 min-w-0">
          <app.headerComponent win={win} />
        </div>
      )}

      <div className="flex items-center gap-2 pointer-events-auto shrink-0">
        <button
          onClick={toggleAppTheme}
          title={
            win.theme === undefined
              ? "Following System Theme"
              : win.theme === "light"
              ? "App: Light Mode"
              : "App: Dark Mode"
          }
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${glassBg} ${textColor} ${hoverBg}`}
        >
          {win.theme === undefined ? (
            <Moon size={14} />
          ) : win.theme === "light" ? (
            <Sun size={14} />
          ) : (
            <Moon size={14} />
          )}
        </button>

        <div className={`w-px h-5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />

        <WindowActions win={win} isDark={isDark} isActive={isActive} />
      </div>
    </div>
  );
};
