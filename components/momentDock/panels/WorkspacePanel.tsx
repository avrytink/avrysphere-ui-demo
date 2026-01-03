import React, { useState } from "react";
import { useWindowStore } from "../../../store/windowStore";
import { Plus, Trash2, Edit2, Monitor, X } from "lucide-react";
import { useOSStore } from "../../../store/osStore";
import { useSphereStore } from "../../../store/sphereStore";
import { DesktopLayout } from "../../../types";

interface WorkspacePanelProps {
  anchorRef?: React.RefObject<HTMLButtonElement>;
}

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ anchorRef }) => {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    addWorkspace,
    removeWorkspace,
    renameWorkspace,
    windows,
  } = useWindowStore();
  const { theme } = useOSStore();
  const { layout } = useSphereStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null);

  const isUnity = layout === DesktopLayout.UNITY;

  // Calculate position on mount
  React.useLayoutEffect(() => {
    if (!isUnity && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        left: rect.left,
        bottom: window.innerHeight - rect.top + 16,
      });
    }
  }, [isUnity, anchorRef]);

  const isDark = theme === "dark";

  const panelBg = isDark
    ? "bg-zinc-900/80 border-white/10"
    : "bg-white/80 border-white/40";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
  const textMuted = isDark ? "text-zinc-500" : "text-zinc-400";
  const cardBg = isDark
    ? "bg-white/5 border-white/10 hover:border-white/20"
    : "bg-white/50 border-white/40 hover:bg-white/70 hover:border-white/60";
  const activeCardBg = isDark
    ? "bg-red-600/10 border-red-600/40"
    : "bg-red-50 border-red-200";

  return (
    <div
      style={!isUnity && pos ? { left: pos.left, bottom: pos.bottom, transform: 'none' } : undefined}
      className={`
      fixed backdrop-blur-3xl border z-[3000] p-6 rounded-[2.5rem] shadow-2xl animate-in duration-300 origin-bottom
      ${panelBg}
      ${
        isUnity
          ? "left-20 bottom-4 w-[340px] slide-in-from-left"
          : "w-[340px] h-auto slide-in-from-bottom-10"
      }
    `}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <h2
          className={`text-sm font-bold uppercase tracking-widest ${textSecondary}`}
        >
          Workspaces
        </h2>
        <button
          onClick={addWorkspace}
          className={`p-2 rounded-xl transition-all ${textMuted} ${
            isDark
              ? "hover:bg-white/5 hover:text-white"
              : "hover:bg-black/5 hover:text-black"
          }`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
              activeWorkspaceId === ws.id ? activeCardBg : cardBg
            }`}
            onClick={() => setActiveWorkspace(ws.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor
                  size={16}
                  className={
                    activeWorkspaceId === ws.id ? "text-red-500" : textSecondary
                  }
                />
                {editingId === ws.id ? (
                  <input
                    autoFocus
                    className={`bg-transparent border-none outline-none text-xs font-bold w-32 ${textPrimary}`}
                    value={ws.name}
                    onBlur={() => setEditingId(null)}
                    onChange={(e) => renameWorkspace(ws.id, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  />
                ) : (
                  <span
                    className={`text-xs font-bold uppercase tracking-tight ${
                      activeWorkspaceId === ws.id ? textPrimary : textMuted
                    }`}
                  >
                    {ws.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(ws.id);
                  }}
                  className={`p-1.5 rounded-lg ${textSecondary} ${
                    isDark
                      ? "hover:bg-white/10 hover:text-white"
                      : "hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <Edit2 size={12} />
                </button>
                {workspaces.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWorkspace(ws.id);
                    }}
                    className={`p-1.5 rounded-lg ${textSecondary} hover:text-red-500 ${
                      isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                    }`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}
              >
                {windows.filter((w) => w.workspaceId === ws.id).length} Active
              </span>
              {activeWorkspaceId === ws.id && (
                <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
