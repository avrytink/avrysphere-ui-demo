import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useWindowStore } from "../../../store/windowStore";
import { useOSStore } from "../../../store/osStore";
import { APP_REGISTRY, AppDefinition } from "../../../registry/AppRegistry";
import { AppId } from "../../../types";
import { Window } from "../../Window";
import { AccountSwitcher } from "../../topBar/AccountSwitcher";
import {
  Search,
  Settings,
  User as UserIcon,
  Clock,
  Battery,
  Wifi,
  Trophy,
  Gamepad2,
  Play,
  Heart,
  Share2,
  MoreHorizontal,
  X,
  Clapperboard,
} from "lucide-react";
import { format } from "date-fns";
import { GamingPillBar } from "./GamingPillBar";
import { GamingHeaderOverlay } from "./GamingHeaderOverlay";

const AAA_GAMES = [
  AppId.CYBERPUNK,
  AppId.ELDEN_RING,
  AppId.GOW_RAGNAROK,
  AppId.SPIDERMAN_2,
  AppId.COD_MW3,
  AppId.BALDURS_GATE,
  AppId.STARFIELD,
  AppId.FF_XVI,
  AppId.GTA_V,
  AppId.FORTNITE,
];

export const GamingLayout: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { windows, activeWorkspaceId, openWindow, closeWindow } =
    useWindowStore();
  const { toggleAccountSwitcher } = useOSStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"games" | "media">("games");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Game Sleek (Bottom Pill) State - 10min timeout
  const [showGameSleek, setShowGameSleek] = useState(false);
  const [lastSleekActivity, setLastSleekActivity] = useState(Date.now());

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  // Create a combined list of apps
  const allCards = useMemo(() => {
    const gameApps = AAA_GAMES.map((id) => APP_REGISTRY[id]).filter(Boolean);
    const modeSwitchers = [AppId.DESKTOP_MODE, AppId.TV_MODE, AppId.TABLET_MODE]
      .map((id) => APP_REGISTRY[id])
      .filter((app) => app && app.id !== AppId.GAME_MODE);
    const systemApps = Object.values(APP_REGISTRY)
      .filter(
        (app) =>
          !AAA_GAMES.includes(app.id) &&
          !app.headless &&
          app.id !== AppId.GAME_MODE &&
          ![AppId.DESKTOP_MODE, AppId.TV_MODE, AppId.TABLET_MODE].includes(
            app.id
          )
      )
      .slice(0, 8);
    return [...gameApps, ...modeSwitchers, ...systemApps];
  }, []);

  const selectedAppDef = allCards[selectedIndex];

  // Find the top-most active window
  const activeWindow = windows
    .filter(
      (w) =>
        w.workspaceId === activeWorkspaceId &&
        w.isOpen &&
        !w.isMinimized &&
        w.appId !== AppId.GAME_MODE
    )
    .sort((a, b) => b.zIndex - a.zIndex)[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Inactivity for Game Sleek Pill (10min = 600,000ms)
  useEffect(() => {
    const checkSleekInactivity = () => {
      // If inactive for 10 mins, show it
      if (Date.now() - lastSleekActivity >= 600000) {
        if (!showGameSleek) setShowGameSleek(true);
      }
    };

    const interval = setInterval(checkSleekInactivity, 1000);
    return () => clearInterval(interval);
  }, [lastSleekActivity, showGameSleek]);

  const handleGlobalActivity = () => {
    setLastSleekActivity(Date.now());
    if (showGameSleek) setShowGameSleek(false);
  };

  // Handle Scroll/Wheel logic
  const handleWheel = (e: React.WheelEvent) => {
    if (activeWindow) return;

    const now = Date.now();
    if (now - lastScrollTime.current < 150) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    if (e.deltaY > 0 && selectedIndex < allCards.length - 1) {
      setSelectedIndex((prev) => prev + 1);
      lastScrollTime.current = now;
    } else if (e.deltaY < 0 && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      lastScrollTime.current = now;
    }
  };

  // Left-align focus logic
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeItem = container.children[selectedIndex] as HTMLElement;
      if (activeItem) {
        const offset = activeItem.offsetLeft - 80;
        container.scrollTo({
          left: offset,
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  const renderAppContent = (appId: AppId) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return null;
    const AppComponent = appDef.component;
    return <AppComponent />;
  };

  const getBackgroundGradient = (app: AppDefinition) => {
    if (app.gradient.includes("yellow"))
      return "linear-gradient(to bottom right, #4a3b00, #050505)";
    if (app.gradient.includes("blue"))
      return "linear-gradient(to bottom right, #001f4d, #050505)";
    if (app.gradient.includes("red"))
      return "linear-gradient(to bottom right, #4d0000, #050505)";
    if (app.gradient.includes("purple"))
      return "linear-gradient(to bottom right, #2d004d, #050505)";
    if (app.gradient.includes("emerald"))
      return "linear-gradient(to bottom right, #00331a, #050505)";
    return "linear-gradient(to bottom right, #1a1a1a, #050505)";
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-[#050505] text-white font-sans select-none relative"
      onWheel={handleWheel}
      onMouseMove={handleGlobalActivity}
      onKeyDown={handleGlobalActivity}
      onClick={handleGlobalActivity}
    >
      {/* Dynamic Immersive Background */}
      <div
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center scale-110"
        style={{
          backgroundImage: selectedAppDef?.iconImage
            ? `url('${selectedAppDef.iconImage}')`
            : "none",
          background:
            !selectedAppDef?.iconImage && selectedAppDef
              ? getBackgroundGradient(selectedAppDef)
              : undefined,
          opacity: activeWindow ? 0.2 : 0.5,
          filter: "blur(40px) saturate(1.5)",
        }}
      />

      {/* Hero Artwork */}
      {selectedAppDef?.iconImage && !activeWindow && (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-1000 overflow-hidden">
          <img
            src={selectedAppDef.iconImage}
            className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-[10000ms] ease-linear hover:scale-110"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </div>
      )}

      {/* Experience Layer */}
      <div
        className={`absolute inset-0 z-20 flex flex-col pt-10 transition-all duration-700 ${
          activeWindow
            ? "scale-95 opacity-0 pointer-events-none blur-3xl"
            : "scale-100 opacity-100"
        }`}
      >
        {/* TOP SECTION: HUD */}
        <div className="h-16 px-20 flex items-center justify-between z-30 mb-6">
          <div className="flex gap-12 items-center">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("games")}
                className={`relative transition-all duration-300 ${
                  activeTab === "games"
                    ? "text-white scale-110"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                <Gamepad2 size={24} strokeWidth={2.5} />
                {activeTab === "games" && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`relative transition-all duration-300 ${
                  activeTab === "media"
                    ? "text-white scale-110"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                <Clapperboard size={24} strokeWidth={2.5} />
                {activeTab === "media" && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 text-white/40">
              <Search
                size={18}
                className="hover:text-white transition-colors cursor-pointer"
              />
              <Settings
                size={18}
                className="hover:text-white transition-colors cursor-pointer"
              />
              <div className="w-px h-4 bg-white/10" />
              <Wifi size={18} />
              <div className="flex items-center gap-2">
                <Battery size={18} className="rotate-90" />
                <span className="text-[10px] font-bold">100%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-4">
              <span className="text-xl font-light tracking-widest text-white/90">
                {format(currentTime, "HH:mm")}
              </span>
              <div
                onClick={toggleAccountSwitcher}
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 shadow-2xl hover:ring-white/30 transition-all cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Apps Carousel (Now circular) */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-hidden flex items-center gap-4 px-20 pt-6 pb-10 transition-all duration-500 no-scrollbar mb-6"
        >
          {allCards.map((app, index) => (
            <button
              key={app.id}
              onClick={() => setSelectedIndex(index)}
              onDoubleClick={() => openWindow(app.id)}
              className={`
                relative flex-shrink-0 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${
                  selectedIndex === index
                    ? "w-24 h-24 ring-4 ring-white shadow-[0_15px_40px_rgba(255,255,255,0.2)] z-20 scale-110"
                    : "w-16 h-16 opacity-30 hover:opacity-60 scale-100 z-10 grayscale-[0.5]"
                }
              `}
            >
              {app.iconImage ? (
                <>
                  <img
                    src={app.iconImage}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop";
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${
                      selectedIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-80`}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                {!app.iconImage && (
                  <app.icon
                    size={selectedIndex === index ? 32 : 24}
                    className="text-white drop-shadow-2xl transition-all duration-500"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* BOTTOM SECTION: Selected App Info */}
        <div className="px-20 mb-auto flex flex-col items-start gap-6 max-w-4xl animate-in slide-in-from-left-10 duration-700">
          {selectedAppDef && (
            <>
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAppDef.gradient} flex items-center justify-center shadow-2xl ring-1 ring-white/20`}
                >
                  <selectedAppDef.icon
                    size={20}
                    className="text-white drop-shadow-md"
                  />
                </div>
                <div className="h-px w-12 bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  {AAA_GAMES.includes(selectedAppDef.id)
                    ? "Licensed Product"
                    : "System Utility"}
                </span>
              </div>

              <h1 className="text-7xl font-black uppercase tracking-tighter leading-none drop-shadow-2xl">
                {selectedAppDef.title}
              </h1>

              {AAA_GAMES.includes(selectedAppDef.id) ? (
                <div className="flex items-center gap-10 text-xs font-bold text-white/60">
                  <div className="flex items-center gap-3">
                    <Trophy size={16} className="text-amber-400" />
                    <div className="flex flex-col">
                      <span className="text-white">42%</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-50">
                        Trophies
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-white">128h</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-50">
                        Played
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-rose-500" />
                    <div className="flex flex-col">
                      <span className="text-white">Master</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-50">
                        Status
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm font-medium tracking-wide max-w-xl">
                  This system modality provides high-fidelity access to core OS
                  capabilities within the immersive environment.
                </p>
              )}

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => openWindow(selectedAppDef.id)}
                  className="h-16 px-14 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-3 text-xs"
                >
                  {AAA_GAMES.includes(selectedAppDef.id)
                    ? "Play Game"
                    : "Execute"}
                </button>
                <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all backdrop-blur-3xl group/btn">
                  <MoreHorizontal
                    size={24}
                    className="text-white/40 group-hover/btn:text-white transition-colors"
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AccountSwitcher />

            {/* Game Sleek Bottom Pill Bar */}
            <GamingPillBar 
              isVisible={showGameSleek}
              onHome={() => {}}
              onSettings={() => {}}
              onStats={() => {}}
            />
      
            {/* Game Sleek Inactivity Overlay */}
            {activeWindow && showGameSleek && (
              <div className="absolute inset-0 z-[60] backdrop-blur-md bg-black/40 flex flex-col items-center justify-center animate-in fade-in duration-700">
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 rounded-full ring-4 ring-[#00AEEF]/40 shadow-[0_0_50px_rgba(0,174,239,0.3)] overflow-hidden animate-pulse bg-black">
                       {APP_REGISTRY[activeWindow.appId]?.iconImage ? (
                         <img src={APP_REGISTRY[activeWindow.appId].iconImage} className="w-full h-full object-cover" alt="" />
                       ) : (
                         <div className={`w-full h-full bg-gradient-to-br ${APP_REGISTRY[activeWindow.appId]?.gradient} flex items-center justify-center`}>
                            {React.createElement(APP_REGISTRY[activeWindow.appId]?.icon, { size: 48, className: "text-white" })}
                         </div>
                       )}
                    </div>
                    <div className="text-center">
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                        {activeWindow.title}
                      </h2>
                      <p className="text-[#00AEEF] font-bold tracking-[0.4em] uppercase text-[10px] mt-3">
                        Session Paused
                      </p>
                    </div>
                    <div className="mt-12 px-10 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                          Move controller or mouse to resume
                       </span>
                    </div>
                 </div>
              </div>
            )}
      
            {/* Active Window Layer */}      {activeWindow && (
        <div className="absolute inset-0 z-50 bg-black animate-in zoom-in-95 duration-300">
          <GamingHeaderOverlay
            activeWindow={activeWindow}
            onClose={() => closeWindow(activeWindow.instanceId)}
            onRestore={() => {}}
          />

          <div className="w-full h-full pt-2">
            <Window window={activeWindow}>
              {renderAppContent(activeWindow.appId)}
            </Window>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
