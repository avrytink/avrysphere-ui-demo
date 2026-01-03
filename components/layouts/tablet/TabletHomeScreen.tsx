import React, { useState, useRef, useMemo } from "react";
import { useTopBarStore } from "../../../store/topBarStore";
import { useWindowStore } from "../../../store/windowStore";
import { useSphereStore } from "../../../store/sphereStore";
import { format } from "date-fns";
import { APP_REGISTRY } from "../../../registry/AppRegistry";
import { Sun, Calendar } from "lucide-react";
import { AppId, OSMode } from "../../../types";

const APPS_PER_PAGE = 20;

export const TabletHomeScreen: React.FC = () => {
  const { dateTime } = useTopBarStore();
  const { openWindow } = useWindowStore();
  const { isMobile, isTablet, isTV, isGaming } = useSphereStore();
  const [currentPage, setCurrentPage] = useState(0);

  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const apps = useMemo(() => {
    const isDesktop = !isMobile && !isTablet && !isTV && !isGaming;
    return Object.values(APP_REGISTRY).filter((app) => {
      if (isDesktop && app.id === AppId.DESKTOP_MODE) return false;
      if (isTablet && app.id === AppId.TABLET_MODE) return false;
      if (isTV && app.id === AppId.TV_MODE) return false;
      if (isGaming && app.id === AppId.GAME_MODE) return false;
      return true;
    });
  }, [isMobile, isTablet, isTV, isGaming]);

  const totalPages = Math.ceil(apps.length / APPS_PER_PAGE);

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = false;
  };

  const handleMove = (clientX: number) => {
    if (startX.current === null) return;
    const diff = Math.abs(startX.current - clientX);
    if (diff > 10) {
      isDragging.current = true;
    }
  };

  const handleEnd = (clientX: number) => {
    if (startX.current === null) return;
    const diff = startX.current - clientX;

    // Swipe Threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    }
    startX.current = null;
    // Reset drag state after click event potential window
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const handleAppClick = (appId: AppId) => {
    if (isDragging.current) return;
    openWindow(appId);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col pt-24 pb-32 animate-in fade-in duration-700 overflow-hidden z-10"
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onMouseUp={(e) => handleEnd(e.clientX)}
      onMouseLeave={() => {
        startX.current = null;
      }}
    >
      {/* Tablet Widget Area - Fades out on swipe */}
      <div
        className={`flex justify-between items-start mb-12 px-20 transition-all duration-700 ${
          currentPage === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px] pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="text-9xl font-black tracking-tighter text-white drop-shadow-2xl select-none leading-none">
            {format(dateTime, "HH:mm")}
          </div>
          <div className="text-3xl font-bold text-white/60 tracking-tight select-none ml-2 uppercase">
            {format(dateTime, "EEEE, MMMM d")}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-3xl px-8 py-6 rounded-[2.5rem] shadow-2xl select-none hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-yellow-500/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Sun size={36} className="text-yellow-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white leading-none">72°F</span>
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] mt-1">
                San Francisco
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-3xl px-8 py-6 rounded-[2.5rem] shadow-2xl select-none hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-red-500/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar size={36} className="text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white leading-none">14:00</span>
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] mt-1">
                Executive Sync
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipeable App Grid */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full h-full flex-shrink-0 grid grid-cols-6 grid-rows-4 gap-y-12 gap-x-4 px-20 content-start"
            >
              {apps
                .slice(
                  pageIndex * APPS_PER_PAGE,
                  (pageIndex + 1) * APPS_PER_PAGE
                )
                .map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-4 group active:scale-90 transition-all duration-300"
                  >
                    <div
                      className={`w-[84px] h-[84px] rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10 group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 overflow-hidden ${
                        app.iconImage
                          ? "bg-black"
                          : `bg-gradient-to-br ${app.gradient}`
                      }`}
                    >
                      {app.iconImage ? (
                        <img
                          src={app.iconImage}
                          className="w-full h-full object-cover"
                          alt={app.title}
                          draggable={false}
                        />
                      ) : (
                        <app.icon
                          size={40}
                          className="text-white drop-shadow-lg"
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors select-none text-center px-2">
                      {app.title}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-36 left-0 right-0 flex justify-center gap-3 pointer-events-none">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentPage ? "bg-white scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
