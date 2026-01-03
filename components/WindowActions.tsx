import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Square } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { useSphereStore } from "../store/sphereStore";
import { WindowState, SnapType } from "../types";

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
  const { isTablet, isMobile, isTV } = useSphereStore();

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

      {!isTablet && !isMobile && !isTV && (
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
      )}

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
