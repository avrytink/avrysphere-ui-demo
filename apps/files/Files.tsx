import React, { useState, useMemo } from "react";
import {
  Folder,
  File,
  ChevronRight,
  HardDrive,
  Star,
  Clock,
  Info,
  Plus,
  Trash2,
  Copy,
  Scissors,
  Share2,
  MoreHorizontal,
  LayoutGrid,
  List,
  Cloud,
  Database,
  Server,
  Smartphone,
  Home,
  Monitor,
  Search,
  Settings as SettingsIcon,
  Filter,
  ArrowUp,
  RefreshCw,
  Shield,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useWindowStore } from "../../store/windowStore";
import { useVFSStore, VFSItem } from "../../store/vfsStore";
import { useOSStore } from "../../store/osStore";
import { useTheme } from "../../components/Window";
import { AppId } from "../../types";
import { StorageProvisioner } from "./StorageProvisioner";

export const Files: React.FC = () => {
  const theme = useTheme();
  const { openChildWindow, closeWindow, windows, activeInstanceId } =
    useWindowStore();

  const getChildren = useVFSStore((s) => s.getChildren);
  const getItemPath = useVFSStore((s) => s.getItemPath);
  const addItem = useVFSStore((s) => s.addItem);
  const removeItem = useVFSStore((s) => s.removeItem);
  const currentFolderId = useVFSStore((s) => s.currentFolderId);
  const setCurrentFolderId = useVFSStore((s) => s.setCurrentFolderId);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentPath = useMemo(
    () => getItemPath(currentFolderId || ""),
    [currentFolderId, getItemPath]
  );
  const currentItems = useMemo(
    () => getChildren(currentFolderId),
    [currentFolderId, getChildren]
  );

  const isDark = theme === "dark";

  const handleNavigate = (id: string | null) => {
    setCurrentFolderId(id);
    setSelectedId(null);
  };

  const handleInspect = (item: VFSItem) => {
    if (activeInstanceId) {
      const existing = windows.find(
        (w) => w.parentId === activeInstanceId && w.appId === AppId.FEELING
      );
      if (existing) closeWindow(existing.instanceId);

      openChildWindow(activeInstanceId, AppId.FEELING, {
        title: `Properties: ${item.name}`,
        width: 420,
        height: 540,
        modal: false,
      });
    }
  };

  const handleAddStorage = () => {
    if (activeInstanceId) {
      openChildWindow(activeInstanceId, AppId.DEV_CENTER, {
        title: "Provision Virtual Storage",
        width: 500,
        height: 640,
        modal: false,
      });
    }
  };

  const handleNewFolder = () => {
    addItem({
      name: "New Folder",
      type: "folder",
      parentId: currentFolderId,
    });
  };

  const ProviderIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "s3":
        return <Database size={16} className="text-orange-400" />;
      case "dropbox":
        return <Cloud size={16} className="text-blue-400" />;
      case "mega":
        return <Server size={16} className="text-red-500" />;
      default:
        return <Folder size={16} className="text-amber-500" />;
    }
  };

  // Styles
  const bgMain = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const bgSidebar = isDark
    ? "bg-black/40 border-white/5"
    : "bg-zinc-50/80 border-zinc-200";
  const bgToolbar = isDark
    ? "bg-black/60 border-white/5"
    : "bg-white/80 border-zinc-200";
  const textPrimary = isDark ? "text-zinc-200" : "text-zinc-800";
  const textSecondary = isDark ? "text-zinc-500" : "text-zinc-500";
  const hoverBg = isDark ? "hover:bg-white/5" : "hover:bg-black/5";
  const activeBg = isDark
    ? "bg-blue-600/10 text-blue-500 ring-1 ring-blue-600/20"
    : "bg-blue-50 text-blue-600 ring-1 ring-blue-200";
  const itemHover = isDark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.02]";
  const itemSelected = isDark
    ? "bg-blue-600/10 ring-2 ring-blue-600/40"
    : "bg-blue-50 ring-2 ring-blue-200";

  return (
    <div
      className={`flex h-full text-sm overflow-hidden flex-col font-sans border rounded-2xl ${bgMain} ${
        isDark ? "border-white/5" : "border-zinc-200"
      }`}
    >
      {/* Windows 11 High-Fidelity Toolbar */}
      <div
        className={`h-14 border-b flex items-center px-4 justify-between backdrop-blur-3xl shrink-0 ${bgToolbar}`}
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={handleNewFolder}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all active:scale-95 group shrink-0 ${hoverBg} ${textPrimary}`}
          >
            <Plus
              size={16}
              className="text-blue-500 group-hover:scale-110 transition-transform"
            />
            <span className="text-xs font-bold hidden sm:inline">New</span>
          </button>

          <div
            className={`w-px h-6 mx-2 ${
              isDark ? "bg-white/10" : "bg-black/10"
            }`}
          />

          <div className="flex items-center gap-1">
            <button
              disabled={!selectedId}
              className={`p-2.5 disabled:opacity-20 transition-all rounded-xl ${hoverBg} ${textSecondary} ${
                isDark ? "hover:text-white" : "hover:text-black"
              }`}
            >
              <Scissors size={14} />
            </button>
            <button
              disabled={!selectedId}
              className={`p-2.5 disabled:opacity-20 transition-all rounded-xl ${hoverBg} ${textSecondary} ${
                isDark ? "hover:text-white" : "hover:text-black"
              }`}
            >
              <Copy size={14} />
            </button>
            <button
              disabled={!selectedId}
              className={`p-2.5 disabled:opacity-20 transition-all rounded-xl ${hoverBg} ${textSecondary} ${
                isDark ? "hover:text-white" : "hover:text-black"
              }`}
            >
              <Share2 size={14} />
            </button>
            <button
              disabled={!selectedId}
              onClick={() => selectedId && removeItem(selectedId)}
              className={`p-2.5 disabled:opacity-20 transition-all rounded-xl hover:text-red-500 ${
                isDark
                  ? "text-zinc-500 hover:bg-red-500/5"
                  : "text-zinc-400 hover:bg-red-50"
              }`}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div
            className={`w-px h-6 mx-2 ${
              isDark ? "bg-white/10" : "bg-black/10"
            }`}
          />

          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shrink-0 ${hoverBg} ${textSecondary}`}
          >
            <Filter size={14} />
            <span className="text-xs font-bold hidden sm:inline">Sort</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex rounded-xl p-1 border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/5"
            }`}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? isDark
                    ? "bg-white/10 text-white shadow-sm"
                    : "bg-white text-black shadow-sm"
                  : isDark
                  ? "text-zinc-600 hover:text-zinc-400"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? isDark
                    ? "bg-white/10 text-white shadow-sm"
                    : "bg-white text-black shadow-sm"
                  : isDark
                  ? "text-zinc-600 hover:text-zinc-400"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mica-style Sidebar */}
        <aside
          className={`hidden md:flex w-64 border-r flex-col p-5 backdrop-blur-3xl shrink-0 ${bgSidebar}`}
        >
          <div className="space-y-8">
            <div>
              <h4 className={`text-xs font-bold mb-5 px-3 ${textSecondary}`}>
                System Hub
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate("root-home")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                    currentFolderId === "root-home"
                      ? activeBg
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  <Home size={16} />
                  <span className="text-xs font-medium tracking-tight">
                    Home
                  </span>
                </button>
                <button
                  onClick={() => handleNavigate("root-desktop")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                    currentFolderId === "root-desktop"
                      ? activeBg
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  <Monitor size={16} />
                  <span className="text-xs font-medium tracking-tight">
                    Desktop
                  </span>
                </button>
                <button
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${textSecondary} ${hoverBg}`}
                >
                  <Star size={16} />
                  <span className="text-xs font-medium tracking-tight">
                    Starred
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h4 className={`text-xs font-bold mb-5 px-3 ${textSecondary}`}>
                Cloud Modalities
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate("cloud-root")}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                    currentFolderId === "cloud-root"
                      ? isDark
                        ? "bg-emerald-600/10 text-emerald-500 ring-1 ring-emerald-600/20"
                        : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  <Cloud size={16} />
                  <span className="text-xs font-medium tracking-tight">
                    Neural Drive
                  </span>
                </button>

                {getChildren("cloud-root").map((storage) => (
                  <button
                    key={storage.id}
                    onClick={() => handleNavigate(storage.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                      currentFolderId === storage.id
                        ? activeBg
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <ProviderIcon type={storage.type} />
                    <span className="text-xs font-medium truncate">
                      {storage.name}
                    </span>
                  </button>
                ))}

                <button
                  onClick={handleAddStorage}
                  className={`w-full flex items-center gap-4 px-4 py-4 mt-2 border border-dashed rounded-3xl transition-all active:scale-95 group ${
                    isDark
                      ? "border-white/10 text-zinc-600 hover:border-white/30 hover:text-zinc-300"
                      : "border-black/10 text-zinc-400 hover:border-black/30 hover:text-zinc-600"
                  }`}
                >
                  <Plus
                    size={16}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                  <span className="text-xs font-bold">Add Storage</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`mt-auto p-4 rounded-3xl border ${
              isDark
                ? "bg-zinc-900/50 border-white/5"
                : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className={`text-xs font-bold ${textSecondary}`}>
                S3 Core
              </span>
              <span className="text-xs font-mono text-blue-500">
                8.4GB Free
              </span>
            </div>
            <div
              className={`h-1 rounded-full overflow-hidden ${
                isDark ? "bg-white/5" : "bg-black/5"
              }`}
            >
              <div className="h-full bg-blue-600 w-[72%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          </div>
        </aside>

        {/* Dynamic Navigation View */}
        <main
          className={`flex-1 flex flex-col relative overflow-hidden ${bgMain}`}
        >
          <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    onDoubleClick={() =>
                      item.type === "folder" || item.type.length > 4
                        ? handleNavigate(item.id)
                        : null
                    }
                    onClick={() => setSelectedId(item.id)}
                    className={`
                      group flex flex-col items-center gap-4 p-5 rounded-[2rem] transition-all cursor-pointer relative
                      ${selectedId === item.id ? itemSelected : itemHover}
                    `}
                  >
                    <div
                      className={`
                      w-24 h-24 flex items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-1 duration-700
                      ${
                        item.type === "file"
                          ? "text-zinc-500"
                          : "text-amber-500"
                      }
                      ${
                        selectedId === item.id
                          ? "drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-105"
                          : ""
                      }
                    `}
                    >
                      {item.type === "file" ? (
                        <File size={72} strokeWidth={1.5} />
                      ) : (
                        <Folder
                          size={72}
                          fill="currentColor"
                          fillOpacity={0.2}
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold text-center truncate w-full ${
                        selectedId === item.id
                          ? "text-blue-400"
                          : isDark
                          ? "text-zinc-600 group-hover:text-zinc-200"
                          : "text-zinc-600 group-hover:text-zinc-900"
                      }`}
                    >
                      {item.name}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInspect(item);
                      }}
                      className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 rounded-xl transition-all active:scale-90 ${
                        isDark
                          ? "hover:bg-white/10 text-zinc-500 hover:text-white"
                          : "hover:bg-black/5 text-zinc-400 hover:text-black"
                      }`}
                    >
                      <Info size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold min-w-[500px]">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark
                          ? "text-zinc-600 border-white/10"
                          : "text-zinc-400 border-zinc-200"
                      }`}
                    >
                      <th className="pb-5 font-bold px-4">Name Identity</th>
                      <th className="pb-5 font-bold px-4">Modified Sequence</th>
                      <th className="pb-5 font-bold px-4">Modality Type</th>
                      <th className="pb-5 font-bold px-4">Allocated Size</th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                    {currentItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() =>
                          item.type === "folder" || item.type.length > 4
                            ? handleNavigate(item.id)
                            : null
                        }
                        className={`group border-b transition-all cursor-pointer ${
                          isDark ? "border-white/5" : "border-zinc-100"
                        } ${
                          selectedId === item.id
                            ? isDark
                              ? "bg-blue-600/5 text-blue-400"
                              : "bg-blue-50 text-blue-600"
                            : itemHover
                        }`}
                      >
                        <td className="py-5 px-4 flex items-center gap-4">
                          {item.type === "file" ? (
                            <File
                              size={16}
                              className={
                                isDark ? "text-zinc-700" : "text-zinc-400"
                              }
                            />
                          ) : (
                            <Folder size={16} className="text-amber-600" />
                          )}
                          {item.name}
                        </td>
                        <td
                          className={`py-5 px-4 ${
                            isDark ? "text-zinc-700" : "text-zinc-400"
                          }`}
                        >
                          {new Date(item.modified).toLocaleDateString()}
                        </td>
                        <td
                          className={`py-5 px-4 ${
                            isDark ? "text-zinc-800" : "text-zinc-300"
                          }`}
                        >
                          {item.type}
                        </td>
                        <td
                          className={`py-5 px-4 ${
                            isDark ? "text-zinc-800" : "text-zinc-300"
                          } font-mono`}
                        >
                          {item.size ? `${item.size} KB` : "STATIC"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {currentItems.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6 pt-24 animate-in zoom-in-90 duration-1000">
                <div
                  className={`w-32 h-32 rounded-full border flex items-center justify-center ${
                    isDark ? "border-white/20" : "border-black/20"
                  }`}
                >
                  <Search
                    size={48}
                    strokeWidth={1}
                    className={isDark ? "text-white" : "text-black"}
                  />
                </div>
                <span
                  className={`text-xs font-bold ml-2 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Null Modal Space
                </span>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer
        className={`h-10 border-t flex items-center px-6 justify-between text-[10px] font-bold shrink-0 ${
          isDark
            ? "border-white/5 text-zinc-700 bg-black/60"
            : "border-zinc-200 text-zinc-400 bg-white/60"
        }`}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            <span>{currentItems.length} Entities Proxied</span>
          </div>
          {selectedId && (
            <span className="text-blue-500 animate-in slide-in-from-left-2 duration-300 hidden sm:inline">
              Handshake Active with {selectedId}
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield size={10} />
            <span className="hidden sm:inline">Layer v2.0-STABLE</span>
          </div>
          <div
            className={`h-4 w-px hidden sm:block ${
              isDark ? "bg-white/10" : "bg-black/10"
            }`}
          />
          <button
            className={`transition-colors hidden sm:block ${
              isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            Neural Sync 100%
          </button>
        </div>
      </footer>
    </div>
  );
};
