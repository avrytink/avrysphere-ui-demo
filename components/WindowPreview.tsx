import React from "react";
import { WindowState } from "../types";
import { APP_REGISTRY } from "../registry/AppRegistry";
import { Minus, Square, X } from "lucide-react";
import { useWindowStore } from "../store/windowStore";

interface WindowPreviewProps {
  win: WindowState;
  isDark?: boolean;
  isActive?: boolean;
  className?: string;
  showIconPlaceholder?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const WindowPreview: React.FC<WindowPreviewProps> = ({
  win,
  isDark = true,
  isActive = false,
  className = "",
  showIconPlaceholder = true,
  onClick,
}) => {
  const app = APP_REGISTRY[win.appId];
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowStore();

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
        isDark ? "bg-[#050505] border-white/10" : "bg-white border-zinc-200"
      } ${className}`}
    >
      {/* Preview Content (Full Window) */}
      <div className="flex-1 relative bg-black/10 overflow-hidden flex items-center justify-center w-full h-full">
        {win.preview ? (
          <img
            src={win.preview}
            className="w-full h-full object-cover object-top opacity-90"
            alt={win.title}
          />
        ) : (
          showIconPlaceholder &&
          app && (
            <div className="opacity-10">
              {app.iconImage ? (
                <img
                  src={app.iconImage}
                  className="w-12 h-12 object-cover rounded-lg"
                  alt=""
                />
              ) : (
                <app.icon size={48} className="text-white" />
              )}
            </div>
          )
        )}
      </div>

      {/* Hover Overlay with Actions */}
      <div className="hidden hover:absolute inset-0 z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 flex items-center justify-center backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.instanceId);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:scale-110 transition-all shadow-xl group/btn"
            title="Minimize"
          >
            <Minus
              size={12}
              className="text-white opacity-80 group-hover/btn:opacity-100"
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.instanceId);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 hover:scale-110 transition-all shadow-xl group/btn"
            title="Maximize"
          >
            <Square
              size={14}
              className="text-white opacity-80 group-hover/btn:opacity-100"
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.instanceId);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30 backdrop-blur-xl hover:bg-red-500 hover:border-red-500 hover:scale-110 transition-all shadow-xl group/btn"
            title="Close"
          >
            <X
              size={12}
              className="text-white opacity-80 group-hover/btn:opacity-100"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
