import React from "react";
import { useOSStore } from "../../store/osStore";
import { useMediaStore } from "../../store/mediaStore";
import { useSphereStore } from "../../store/sphereStore";
import { useAuthStore } from "../../store/authStore";
import { DesktopLayout } from "../../types";
import {
  Wifi,
  Bluetooth,
  Volume2,
  Sun,
  Shield,
  Zap,
  Moon,
  Airplay,
  RotateCcw,
  Sidebar,
  PanelBottom,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Lock,
} from "lucide-react";

export const ControlCenter: React.FC = () => {
  const {
    controlCenterOpen,
    setSettings,
    wifiEnabled,
    bluetoothEnabled,
    volume,
    brightness,
    theme,
    toggleTheme,
    closeEverything,
  } = useOSStore();
  const { layout, setLayout } = useSphereStore();
  const { lockSession } = useAuthStore();

  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, mediaType } =
    useMediaStore();

  const isDark = theme === "dark";
  const isUnity = layout === DesktopLayout.UNITY;

  // Enhanced Contrast Styles
  const panelBg = isDark
    ? "bg-zinc-900/75 border-white/10"
    : "bg-white/75 border-white/40";
  const cardBg = isDark
    ? "bg-white/5 border-white/5"
    : "bg-white/60 border-white/40 shadow-sm";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
  const iconColor = isDark ? "text-zinc-300" : "text-zinc-600";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-black/5";

  const switchToLayout = (layoutType: DesktopLayout) => {
    setLayout(layoutType);
    closeEverything();
  };

  if (!controlCenterOpen) return null;

  return (
    <div
      className={`
        fixed w-[420px] gap-4 rounded-[1.5rem] backdrop-blur-3xl border-l z-[5000] p-6 flex flex-col shadow-2xl animate-in duration-300
        ${panelBg}
          
        ${
          isUnity
            ? "left-[calc(80px+1rem)] top-4 bottom-4 slide-in-from-left"
            : "right-[calc(1rem)] top-16 bottom-4 slide-in-from-right"
        }
      `}
    >
      {/* Experience Switcher */}
      <div
        className={`p-1 rounded-[1.25rem] flex ${
          isDark ? "bg-white/5" : "bg-black/5"
        }`}
      >
        <button
          onClick={() => switchToLayout(DesktopLayout.UNITY)}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            layout === DesktopLayout.UNITY
              ? isDark
                ? "bg-white/10 text-white shadow-sm"
                : "bg-white text-black shadow-sm"
              : `${textSecondary} ${hoverBg}`
          }`}
        >
          <Sidebar size={14} /> Sidebar
        </button>
        <button
          onClick={() => switchToLayout(DesktopLayout.AVRY)}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            layout === DesktopLayout.AVRY
              ? isDark
                ? "bg-white/10 text-white shadow-sm"
                : "bg-white text-black shadow-sm"
              : `${textSecondary} ${hoverBg}`
          }`}
        >
          <PanelBottom size={14} /> Floating
        </button>
      </div>

      {/* Media Player Widget */}
      <div
        className={`border rounded-[1.5rem] p-4 flex items-center gap-4 relative overflow-hidden group ${cardBg}`}
      >
        <div
          className={`relative z-10 w-16 h-16 rounded-2xl overflow-hidden shadow-lg border shrink-0 ${
            isDark ? "border-white/10" : "border-white/20"
          }`}
        >
          <img
            src={currentTrack.cover}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? "scale-110" : "scale-100 grayscale"
            }`}
            alt={currentTrack.title}
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              {mediaType === 'video' ? (
                <Play size={24} className="text-white fill-white animate-pulse" />
              ) : (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-1 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]" />
                  <div className="w-1 bg-white animate-[music-bar_0.8s_ease-in-out_infinite]" />
                  <div className="w-1 bg-white animate-[music-bar_1.0s_ease-in-out_infinite]" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2 mb-0.5">
            {mediaType === 'video' && (
              <span className="px-1 py-0.5 bg-blue-600 text-white text-[7px] font-black uppercase rounded">Video</span>
            )}
            <div className={`text-xs font-bold truncate ${textPrimary}`}>
              {currentTrack.title}
            </div>
          </div>
          <div
            className={`text-[10px] font-medium truncate mb-3 ${textSecondary}`}
          >
            {currentTrack.artist}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevTrack}
              className={`p-1.5 transition-colors rounded-lg ${iconColor} ${hoverBg}`}
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className={`p-1.5 hover:scale-110 transition-transform active:scale-95 ${textPrimary}`}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className={`p-1.5 transition-colors rounded-lg ${iconColor} ${hoverBg}`}
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Dynamic Background Blur */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none blur-2xl transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${currentTrack.cover}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => setSettings({ wifiEnabled: !wifiEnabled })}
          className={`p-4 rounded-[1.5rem] flex flex-col gap-3 cursor-pointer transition-all border ${
            wifiEnabled
              ? "bg-blue-600 text-white border-blue-600"
              : `${cardBg} ${textSecondary} ${hoverBg}`
          }`}
        >
          <Wifi size={20} />
          <div className="text-xs font-bold">Wi-Fi</div>
        </div>
        <div
          onClick={() => setSettings({ bluetoothEnabled: !bluetoothEnabled })}
          className={`p-4 rounded-[1.5rem] flex flex-col gap-3 cursor-pointer transition-all border ${
            bluetoothEnabled
              ? "bg-indigo-600 text-white border-indigo-600"
              : `${cardBg} ${textSecondary} ${hoverBg}`
          }`}
        >
          <Bluetooth size={20} />
          <div className="text-xs font-bold">Bluetooth</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div
          className={`aspect-square border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${cardBg} ${hoverBg}`}
        >
          <Airplay size={18} className={textSecondary} />
          <span className={`text-[9px] font-bold ${textSecondary}`}>Cast</span>
        </div>

        <div
          onClick={toggleTheme}
          className={`aspect-square border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            isDark
              ? "bg-white/10 border-white/20 text-white"
              : `${cardBg} ${hoverBg}`
          }`}
        >
          <Moon size={18} className={isDark ? "text-white" : textSecondary} />
          <span
            className={`text-[9px] font-bold ${
              isDark ? "text-white" : textSecondary
            }`}
          >
            {isDark ? "Dark" : "Light"}
          </span>
        </div>

        <div
          className={`aspect-square border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${cardBg} ${hoverBg}`}
        >
          <Shield size={18} className={textSecondary} />
          <span className={`text-[9px] font-bold ${textSecondary}`}>
            Safety
          </span>
        </div>

        <div
          className={`aspect-square border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${cardBg} ${hoverBg}`}
        >
          <Zap size={18} className={textSecondary} />
          <span className={`text-[9px] font-bold ${textSecondary}`}>Focus</span>
        </div>
      </div>

      <div className={`space-y-6 p-5 rounded-[1.5rem] border ${cardBg}`}>
        <div className="space-y-3">
          <div className={`flex items-center justify-between ${textSecondary}`}>
            <Sun size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Display
            </span>
          </div>
          <input
            type="range"
            value={brightness}
            onChange={(e) =>
              setSettings({ brightness: Number(e.target.value) })
            }
            className={`w-full h-1.5 appearance-none rounded-full cursor-pointer ${
              isDark ? "bg-zinc-800 accent-white" : "bg-black/10 accent-black"
            }`}
          />
        </div>

        <div className="space-y-3">
          <div className={`flex items-center justify-between ${textSecondary}`}>
            <Volume2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Volume
            </span>
          </div>
          <input
            type="range"
            value={volume}
            onChange={(e) => setSettings({ volume: Number(e.target.value) })}
            className={`w-full h-1.5 appearance-none rounded-full cursor-pointer ${
              isDark ? "bg-zinc-800 accent-white" : "bg-black/10 accent-black"
            }`}
          />
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between px-2">
        <button
          onClick={lockSession}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${textSecondary} ${hoverBg}`}
        >
          <Lock size={14} />
          <span className="text-xs font-bold">Lock Screen</span>
        </button>
        <button
          className={`p-2 rounded-xl transition-colors ${textSecondary} ${hoverBg}`}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
};
