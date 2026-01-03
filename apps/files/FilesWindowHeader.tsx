import React, { useMemo } from "react";
import { ChevronRight, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useVFSStore } from "../../store/vfsStore";
import { useTheme } from "../../components/Window";

export const FilesWindowHeader: React.FC<{ win: any }> = () => {
  const currentFolderId = useVFSStore((s) => s.currentFolderId);
  const setCurrentFolderId = useVFSStore((s) => s.setCurrentFolderId);
  const getItemPath = useVFSStore((s) => s.getItemPath);

  const theme = useTheme();
  const isDark = theme === "dark";
  const currentPath = useMemo(
    () => getItemPath(currentFolderId || ""),
    [currentFolderId, getItemPath]
  );

  const textColor = isDark ? "text-zinc-200" : "text-zinc-800";
  const hoverBg = isDark ? "hover:bg-white/20" : "hover:bg-black/20";
  const glassBg = isDark ? "bg-white/10" : "bg-black/10";

  return (
    <div className="flex items-center gap-4 flex-1 px-4 pointer-events-auto">
      {/* Navigation History */}
      <div className="flex items-center gap-1">
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg} opacity-40`}
          disabled
        >
          <ArrowLeft size={14} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg} opacity-40`}
          disabled
        >
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Breadcrumbs Address Bar */}
      <div
        className={`flex-1 flex items-center h-8 px-3 rounded-full transition-all focus-within:ring-2 focus-within:ring-blue-500/20 ${glassBg}`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {currentPath.map((p, i) => (
            <React.Fragment key={p.id}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFolderId(p.id);
                }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                  isDark
                    ? "text-zinc-300 hover:text-white hover:bg-white/10"
                    : "text-zinc-700 hover:text-black hover:bg-black/10"
                }`}
              >
                {p.name}
              </button>
              {i < currentPath.length - 1 && (
                <ChevronRight
                  size={10}
                  className={isDark ? "text-zinc-600" : "text-zinc-400"}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg}`}
      >
        <Search size={14} />
      </button>
    </div>
  );
};
