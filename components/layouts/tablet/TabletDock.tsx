import React, { useMemo, useRef } from "react";
import { useWindowStore } from "../../../store/windowStore";
import { useOSStore } from "../../../store/osStore";
import { useDockStore } from "../../../store/dockStore";
import { useSphereStore } from "../../../store/sphereStore";
import { AppId, DesktopLayout } from "../../../types";
import { PINNED_APPS } from "../../momentDock/Constants";
import { AppIcon } from "../../momentDock/AppIcon";
import { Monitor } from "lucide-react";
import { WorkspacePanel } from "../../momentDock/panels/WorkspacePanel";

export const TabletDock: React.FC = () => {
  const { windows, activeWorkspaceId } = useWindowStore();
  const { theme } = useOSStore();
  const { workspacePanelOpen, toggleWorkspacePanel } = useDockStore();
  const { layout } = useSphereStore();

  const workspaceButtonRef = useRef<HTMLButtonElement>(null);

  const isDark = theme === "dark";
  const isUnity = layout === DesktopLayout.UNITY;

  // Styles
  const dockBg = isDark
    ? "bg-black/40 border-white/10"
    : "bg-white/60 border-white/40";
  const separatorColor = isDark ? "bg-white/10" : "bg-black/10";
  const iconColor = isDark
    ? "text-zinc-300 hover:text-white"
    : "text-white-600 hover:text-black";
  const iconActive = isDark
    ? "bg-zinc-800 text-white"
    : "bg-white text-black shadow-md";

  // Determine if we should show the dock
  // Show only if NO windows are open, OR all open windows are minimized (Home Screen state)
  const showDock = useMemo(() => {
    const activeWorkspaceWindows = windows.filter(
      (w) => w.workspaceId === activeWorkspaceId
    );
    return (
      activeWorkspaceWindows.length === 0 ||
      activeWorkspaceWindows.every((w) => w.isMinimized)
    );
  }, [windows, activeWorkspaceId]);

  const runningUnpinnedApps = useMemo(() => {
    const seen = new Set<AppId>(PINNED_APPS);
    const list: AppId[] = [];

    // Only show unpinned apps that are running in current workspace
    // Reverse to show most recently opened on right
    [...windows].reverse().forEach((w) => {
      if (
        !seen.has(w.appId) &&
        w.workspaceId === activeWorkspaceId &&
        w.isOpen
      ) {
        seen.add(w.appId);
        list.push(w.appId);
      }
    });
    return list.slice(0, 3); // Max 3 recent
  }, [windows, activeWorkspaceId]);

  return (
    <>
      <div 
        className={`
          fixed left-1/2 -translate-x-1/2 z-[1000] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${showDock ? 'bottom-8 translate-y-0 opacity-100 scale-100' : '-bottom-32 translate-y-full opacity-0 scale-90 pointer-events-none'}
        `}
      >
        <div className={`h-[100px] backdrop-blur-3xl border rounded-[3rem] flex items-center px-8 gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all ${dockBg} border-white/20`}>
          
          {/* Favorites */}
          <div className="flex items-center gap-5">
              {PINNED_APPS.map(appId => (
                  <div key={appId} className="w-16 h-16 flex items-center justify-center transition-all hover:-translate-y-4 hover:scale-110 duration-500 ease-out active:scale-95">
                      <AppIcon appId={appId} />
                  </div>
              ))}
          </div>

          {/* Separator */}
          {(runningUnpinnedApps.length > 0) && (
              <div className={`w-px h-12 ${separatorColor} mx-2`} />
          )}

          {/* Running / Recent */}
          {runningUnpinnedApps.length > 0 && (
              <div className="flex items-center gap-5">
                  {runningUnpinnedApps.map(appId => (
                      <div key={appId} className="w-16 h-16 flex items-center justify-center transition-all hover:-translate-y-4 hover:scale-110 duration-500 ease-out active:scale-95">
                          <AppIcon appId={appId} />
                      </div>
                  ))}
              </div>
          )}

          <div className={`w-px h-12 ${separatorColor} mx-2`} />

          {/* System Actions */}
          <div className="flex items-center gap-5">
              <button
                ref={workspaceButtonRef}
                onClick={toggleWorkspacePanel}
                className={`w-16 h-16 flex items-center justify-center rounded-full transition-all hover:-translate-y-4 hover:scale-110 duration-500 ease-out active:scale-95 ${
                  workspacePanelOpen
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : `${
                        isDark ? "bg-white/10" : "bg-black/10"
                      } ${iconColor} border border-white/10`
                }`}
              >
                <Monitor size={28} strokeWidth={2.5} />
              </button>
              <div className="w-16 h-16 flex items-center justify-center transition-all hover:-translate-y-4 hover:scale-110 duration-500 ease-out active:scale-95">
                  <AppIcon appId={AppId.DESKTOP_MODE} />
              </div>
          </div>

        </div>
      </div>
      {workspacePanelOpen && !isUnity && <WorkspacePanel anchorRef={workspaceButtonRef} />}
    </>
  );
};
