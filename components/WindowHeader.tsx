import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Square, Moon, Sun, Monitor } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { useSphereStore } from "../store/sphereStore";
import { WindowState, SnapType, AppId } from "../types";
import { APP_REGISTRY } from "../registry/AppRegistry";
import { WindowActions } from "./WindowActions";

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
