import React from "react";
import {
  Plus,
  Monitor,
  Search,
  Bell,
} from "lucide-react";
import { AppId } from "../../types";

export const UnityDock: React.FC<{
  isUnity: boolean;
  isDockHidden: boolean;
  sidebarBgMaximized: string;
  sidebarBg: string;
  LauncherBtn: React.ReactNode;
  dividerColor: string;
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
  toggleSpotlight: () => void;
  toggleNotifications: () => void;
  notificationsOpen: boolean;
  toggleControlCenter: () => void;
  controlCenterOpen: boolean;
  toggleAccountSwitcher: () => void;
  accountSwitcherOpen: boolean;
  currentUser: any;
  iconBgHover: string;
}> = ({
  isUnity,
  isDockHidden,
  sidebarBgMaximized,
  sidebarBg,
  LauncherBtn,
  dividerColor,
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
  toggleSpotlight,
  toggleNotifications,
  notificationsOpen,
  toggleControlCenter,
  controlCenterOpen,
  toggleAccountSwitcher,
  accountSwitcherOpen,
  currentUser,
  iconBgHover,
}) => {
  return (
    <aside
      className={`fixed left-0 ${
        isUnity ? "top-0" : "top-8"
      } bottom-0 flex flex-col items-center w-20 py-6 gap-6 border-r z-[900] transition-all duration-500 ${
        isDockHidden ? sidebarBgMaximized : sidebarBg
      }`}
    >
      <div className="flex flex-col items-center gap-3 w-full">
        {/* 1. Launcher */}
        {LauncherBtn}
        <div className={`w-4 h-px ${dividerColor}`} />
        {/* 2. Apps */}
        <div className="flex flex-col items-center gap-4 w-full">
          {AppsGroup}
        </div>
        {/* 3. Workspaces */}
        <div className={`flex flex-col items-center w-full px-3`}>
          <div
            className={`flex flex-col items-center gap-3 w-full py-2 bg-black/10 rounded-full transition-all`}
          >
            <div className="flex flex-col items-center gap-2">
              {workspaces.slice(0, 4).map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspace(ws.id)}
                  className={`w-10 h-9 rounded-full bg-cover bg-center transition-all ${
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
            <div
              className={`w-4 h-px ${isDark ? "bg-white/10" : "bg-white/40"}`}
            />
            <button
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
        </div>
      </div>
      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        {/* Sidebar matching horizontal order logic */}
        {/* 1. Search */}
        <button
          onClick={toggleSpotlight}
          className={`w-10 h-10 p-2 rounded-full flex items-center justify-center transition-all bg-white/20 ${iconColor} ${iconBgHover}`}
        >
          <Search size={18} />
        </button>
        {/* 3. Notifications */}
        <button
          onClick={toggleNotifications}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/20 ${
            notificationsOpen
              ? "bg-blue-600 text-white shadow-lg"
              : `${iconColor} ${iconBgHover}`
          }`}
        >
          <Bell
            size={18}
            className={`transition-all duration-500 -rotate-[15deg]text-white`}
          />
          <div className="absolute top-[-4px] right-[-4px] ml-1.5 px-1.5 min-w-[1.125rem] h-[1.125rem] flex items-center justify-center bg-red-600 rounded-full text-[9px] font-black text-white shadow-lg border border-black/20">
            2
          </div>
        </button>
        {/* 4. Control Center */}
        <button
          onClick={toggleControlCenter}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/20 ${
            controlCenterOpen
              ? "bg-blue-600 text-white shadow-lg"
              : `${iconColor} ${iconBgHover}`
          }`}
        >
          <div className="flex flex-col gap-1">
            <div
              className={`w-4 h-0.5 rounded-full transition-colors duration-500 bg-zinc-300 ${iconBgHover}`}
            />
            <div
              className={`w-4 h-0.5 rounded-full transition-colors duration-500 bg-zinc-300 ${iconBgHover}`}
            />
          </div>
        </button>
        {/* 5. Accounts switcher */}
        <button
          onClick={toggleAccountSwitcher}
          className={`w-10 h-10 p-2 rounded-full flex items-center justify-center transition-all bg-white/20 ${
            accountSwitcherOpen
              ? "bg-blue-600 text-white shadow-lg"
              : `${iconColor} ${iconBgHover}`
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover rounded-full"
          />
        </button>
      </div>
    </aside>
  );
};
