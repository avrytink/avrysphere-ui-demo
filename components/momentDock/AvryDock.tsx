import React from "react";
import {
  Plus,
  Monitor,
  Terminal,
  Sparkles,
  Search,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from "lucide-react";
import { AppId } from "../../types";

export const AvryDock: React.FC<{
  setIsHoveringEdge: (hovering: boolean) => void;
  isDockHidden: boolean;
  dockBg: string;
  LauncherBtn: React.ReactNode;
  AppsGroup: React.ReactNode;
  workspaces: any[];
  setActiveWorkspace: (id: string) => void;
  activeWorkspaceId: string;
  addWorkspace: () => void;
  isDark: boolean;
  iconColor: string;
  toggleWorkspacePanel: () => void;
  workspacePanelOpen: boolean;
  iconActive: string;
  currentTrack: any;
  isPlaying: boolean;
  prevTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  mediaType: string;
  openWindow: (appId: AppId) => void;
  toggleAIPanel: () => void;
  AIPanelOpen: boolean;
  toggleSpotlight: () => void;
  iconBgHover: string;
  launcherRef: React.RefObject<HTMLButtonElement>;
  workspaceButtonRef: React.RefObject<HTMLButtonElement>;
  aiButtonRef: React.RefObject<HTMLButtonElement>;
}> = ({
  setIsHoveringEdge,
  isDockHidden,
  dockBg,
  LauncherBtn,
  AppsGroup,
  workspaces,
  setActiveWorkspace,
  activeWorkspaceId,
  addWorkspace,
  isDark,
  iconColor,
  toggleWorkspacePanel,
  workspacePanelOpen,
  iconActive,
  currentTrack,
  isPlaying,
  prevTrack,
  togglePlay,
  nextTrack,
  mediaType,
  openWindow,
  toggleAIPanel,
  AIPanelOpen,
  toggleSpotlight,
  iconBgHover,
  launcherRef,
  workspaceButtonRef,
  aiButtonRef,
}) => {
  return (
    <div
      onMouseEnter={() => setIsHoveringEdge(true)}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[900] flex items-center gap-3 transition-all duration-700 cubic-bezier(0.32,0.72,0,1) ${
        isDockHidden
          ? "translate-y-[150%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      {/* 1. Launcher */}
      <div
        className={`relative flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        {LauncherBtn}
      </div>

      <div className={`w-px h-5 ${isDark ? "bg-white/40" : "bg-white/30"}`} />

      {/* 2. Apps */}
      <div
        className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        {AppsGroup}
      </div>

      <div className={`w-px h-5 ${isDark ? "bg-white/40" : "bg-white/30"}`} />

      {/* 3. Workspaces */}
      <div
        className={`flex items-center gap-2 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        <div className="flex items-center gap-2">
          {workspaces.slice(0, 4).map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              className={`w-[53px] h-10 rounded-full bg-cover bg-center transition-all ${
                activeWorkspaceId === ws.id
                  ? "border border-white brightness-110 shadow-lg"
                  : "border border-white/30 opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundImage: `url('${ws.background}')` }}
            />
          ))}
          <button
            onClick={addWorkspace}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              isDark ? "bg-white/5" : "bg-black/5"
            } ${iconColor} border border-white/10`}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className={`w-px h-4 ${isDark ? "bg-white/10" : "bg-white/40"}`} />
        <button
          ref={workspaceButtonRef}
          onClick={toggleWorkspacePanel}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            workspacePanelOpen
              ? iconActive
              : `${
                  isDark ? "bg-white/5" : "bg-black/5"
                } ${iconColor} border border-white/10`
          }`}
        >
          <Monitor size={18} />
        </button>
      </div>

      <div className={`w-px h-5 ${isDark ? "bg-white/40" : "bg-white/30"}`} />

      {/* 4. Media Zone */}
      <div
        className={`flex items-center gap-3 px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all group relative h-16 ${dockBg}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative group/media">
            <div
              className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-lg ${
                isPlaying
                  ? mediaType === "video"
                    ? "border-blue-500"
                    : "border-red-500 animate-[spin_8s_linear_infinite]"
                  : "border-white/20"
              }`}
            >
              <img
                src={currentTrack.cover}
                className="w-full h-full object-cover"
                alt="Album"
              />
              {mediaType === "video" && isPlaying && (
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                  <Play
                    size={16}
                    className="text-white fill-white animate-pulse"
                  />
                </div>
              )}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover/media:opacity-100 transition-all pointer-events-none scale-90 group-hover/media:scale-100 whitespace-nowrap z-[1001] shadow-2xl">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-black text-white uppercase tracking-tight">
                  {mediaType === "video"
                    ? `VIDEO: ${currentTrack.title}`
                    : currentTrack.title}
                </span>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                  {currentTrack.artist}
                </span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black/80" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevTrack}
              className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <SkipBack
                size={14}
                className="text-white/60"
                fill="currentColor"
              />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              {isPlaying ? (
                <Pause size={14} className="text-white" fill="white" />
              ) : (
                <Play size={14} className="text-white ml-0.5" fill="white" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <SkipForward size={14} className="text-white/60" fill="white" />
            </button>
          </div>
        </div>
      </div>

      <div className={`w-px h-5 ${isDark ? "bg-white/40" : "bg-white/30"}`} />

      {/* 5. Terminal zone */}
      <div
        className={`flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        <button
          onClick={() => openWindow(AppId.TERMINAL)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconColor} ${iconBgHover}`}
        >
          <Terminal size={20} />
        </button>
      </div>

      {/* 6. AI zone */}
      <div
        className={`flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        <button
          ref={aiButtonRef}
          onClick={toggleAIPanel}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
            AIPanelOpen
              ? "bg-blue-600 text-white shadow-lg"
              : `${iconColor} ${iconBgHover}`
          }`}
        >
          <Sparkles size={20} />
        </button>
      </div>

      {/* 7. Search Zone */}
      <div
        className={`flex items-center justify-center px-3 backdrop-blur-3xl border rounded-full shadow-2xl transition-all h-16 ${dockBg}`}
      >
        <button
          onClick={toggleSpotlight}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconColor} ${iconBgHover}`}
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};
