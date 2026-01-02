import React, { useMemo, useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useDockStore } from "../../store/dockStore";
import { useWindowStore } from "../../store/windowStore";
import { useOSStore } from "../../store/osStore";
import { useSphereStore } from "../../store/sphereStore";
import { APP_REGISTRY } from "../../registry/AppRegistry";
import { DesktopLayout, AppId } from "../../types";

export const LauncherPanel: React.FC = () => {
  const { launcherSearchQuery, setLauncherSearchQuery, toggleLauncher } =
    useDockStore();
  const { openWindow } = useWindowStore();
  const { theme } = useOSStore();
  const { layout, isTablet } = useSphereStore();
  const [page, setPage] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);

  const isUnity = layout === DesktopLayout.UNITY;
  const isDark = theme === "dark";

  const ITEMS_PER_PAGE = 16;

  const panelBg = isDark
    ? "bg-zinc-900/80 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
    : "bg-white/85 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)]";
  const inputBg = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-zinc-400"
    : "bg-black/5 border-black/10 text-zinc-900 placeholder:text-zinc-500";
  const inputFocus = isDark
    ? "focus:border-white/30 focus:bg-white/10"
    : "focus:border-black/20 focus:bg-black/10";
  const textColor = isDark
    ? "text-zinc-200 group-hover:text-white"
    : "text-zinc-700 group-hover:text-black";
  const iconBorder = isDark ? "border-white/10" : "border-black/5";

  const filteredApps = useMemo(() => {
    let apps = Object.values(APP_REGISTRY);

    apps = apps.filter((app) => {
      if (isTablet && app.id === AppId.TABLET_MODE) return false;
      if (!isTablet && app.id === AppId.DESKTOP_MODE) return false;
      return true;
    });

    if (!launcherSearchQuery) return apps;
    return apps.filter((app) =>
      app.title.toLowerCase().includes(launcherSearchQuery.toLowerCase())
    );
  }, [launcherSearchQuery, isTablet]);

  useEffect(() => {
    setPage(0);
  }, [launcherSearchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApps.length / ITEMS_PER_PAGE)
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && page < totalPages - 1) {
      setPage((prev) => prev + 1);
    }

    if (isRightSwipe && page > 0) {
      setPage((prev) => prev - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return;

    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0 && page < totalPages - 1) {
        setPage((prev) => prev + 1);
        lastScrollTime.current = now;
      } else if (e.deltaY < 0 && page > 0) {
        setPage((prev) => prev - 1);
        lastScrollTime.current = now;
      }
    }
  };

  return (
    <div
      className={`
      flex flex-col backdrop-blur-3xl z-[3000] overflow-hidden border rounded-[2rem] transition-all
      ${panelBg}
      ${
        isUnity
          ? "fixed left-[calc(80px+1rem)] top-12 bottom-4 w-[640px] animate-in fade-in slide-in-from-left-4 duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          : "fixed bottom-[110px] left-1/2 -translate-x-1/2 w-[580px] h-[80vh] max-h-[80vh] animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-bottom"
      }
    `}
    >
      <div
        className="flex-1 relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className="absolute inset-0 flex flex-nowrap transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full h-full flex-shrink-0 p-10 pt-12"
            >
              <div className="grid grid-cols-4 gap-x-6 gap-y-10 place-items-start justify-items-center">
                {filteredApps
                  .slice(
                    pageIndex * ITEMS_PER_PAGE,
                    (pageIndex + 1) * ITEMS_PER_PAGE
                  )
                  .map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        openWindow(app.id);
                        toggleLauncher();
                      }}
                      className="flex flex-col items-center gap-3 cursor-pointer group w-24 focus:outline-none"
                    >
                      <div
                        className={`w-[5.2rem] h-[5.2rem] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 group-active:scale-95 group-hover:shadow-2xl border overflow-hidden ${iconBorder} ${
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
                          />
                        ) : (
                          <app.icon
                            size={32}
                            className="text-white drop-shadow-md"
                          />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-bold transition-colors text-center leading-tight tracking-tight w-full truncate px-1 uppercase ${textColor}`}
                      >
                        {app.title}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination & Search Area */}
      <div
        className={`flex flex-col items-center gap-6 p-8 pt-2 pb-12 shrink-0`}
      >
        {totalPages > 1 && (
          <div className="h-6 flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`
                  rounded-full transition-all duration-500 
                  ${
                    i === page
                      ? isDark
                        ? "bg-white w-2.5 h-2.5 scale-110"
                        : "bg-black w-2.5 h-2.5 scale-110"
                      : isDark
                      ? "bg-white/20 hover:bg-white/40 w-1.5 h-1.5"
                      : "bg-black/20 hover:bg-black/40 w-1.5 h-1.5"
                  }
                `}
              />
            ))}
          </div>
        )}

        <div className="relative w-full max-w-[460px] group">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            autoFocus
            className={`w-full py-4 pl-14 pr-8 rounded-[1.25rem] text-sm font-bold outline-none border transition-all ${inputBg} ${inputFocus}`}
            placeholder="Search all modalities..."
            value={launcherSearchQuery}
            onChange={(e) => setLauncherSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
