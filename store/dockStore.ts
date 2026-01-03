import { create } from "zustand";
import { DockStore } from "../types";
import { useOSStore } from "./osStore";
import { AccountSwitcher } from "../components/topBar/AccountSwitcher";

export const useDockStore = create<DockStore>((set) => ({
  dockCollapsed: false,
  launcherOpen: false,
  AIPanelOpen: false,
  notificationsOpen: false,
  profileOpen: false,
  workspacePanelOpen: false,
  launcherSearchQuery: "",

  setDockCollapsed: (collapsed) => set({ dockCollapsed: collapsed }),
  setLauncherOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({
      launcherOpen: open,
      AIPanelOpen: false,
      notificationsOpen: false,
      profileOpen: false,
      workspacePanelOpen: false,
    });
  },
  setAIPanelOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({
      AIPanelOpen: open,
      launcherOpen: false,
      notificationsOpen: false,
      profileOpen: false,
      workspacePanelOpen: false,
    });
  },
  setNotificationsOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({
      notificationsOpen: open,
      launcherOpen: false,
      AIPanelOpen: false,
      profileOpen: false,
      workspacePanelOpen: false,
    });
  },
  setProfileOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({
      profileOpen: open,
      launcherOpen: false,
      AIPanelOpen: false,
      notificationsOpen: false,
      workspacePanelOpen: false,
    });
  },
  setWorkspacePanelOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({
      workspacePanelOpen: open,
      launcherOpen: false,
      AIPanelOpen: false,
      notificationsOpen: false,
      profileOpen: false,
    });
  },
  setLauncherSearchQuery: (query) => set({ launcherSearchQuery: query }),

  toggleLauncher: () =>
    set((s) => {
      const next = !s.launcherOpen;
      if (next) useOSStore.getState().closeAllOSPanels();
      return {
        launcherOpen: next,
        AIPanelOpen: false,
        notificationsOpen: false,
        profileOpen: false,
        workspacePanelOpen: false,
      };
    }),
  toggleAIPanel: () =>
    set((s) => {
      const next = !s.AIPanelOpen;
      if (next) useOSStore.getState().closeAllOSPanels();
      return {
        AIPanelOpen: next,
        launcherOpen: false,
        notificationsOpen: false,
        profileOpen: false,
        workspacePanelOpen: false,
      };
    }),
  toggleNotifications: () =>
    set((s) => {
      const next = !s.notificationsOpen;
      if (next) useOSStore.getState().closeAllOSPanels();
      return {
        notificationsOpen: next,
        launcherOpen: false,
        AIPanelOpen: false,
        profileOpen: false,
        workspacePanelOpen: false,
      };
    }),
  toggleProfile: () =>
    set((s) => {
      const next = !s.profileOpen;
      if (next) useOSStore.getState().closeAllOSPanels();
      return {
        profileOpen: next,
        launcherOpen: false,
        AIPanelOpen: false,
        notificationsOpen: false,
        workspacePanelOpen: false,
      };
    }),
  toggleWorkspacePanel: () =>
    set((s) => {
      const next = !s.workspacePanelOpen;
      if (next) useOSStore.getState().closeAllOSPanels();
      return {
        workspacePanelOpen: next,
        launcherOpen: false,
        AIPanelOpen: false,
        notificationsOpen: false,
        profileOpen: false,
      };
    }),

  closeAllDockPanels: () =>
    set({
      launcherOpen: false,
      AIPanelOpen: false,
      notificationsOpen: false,
      profileOpen: false,
      workspacePanelOpen: false,
    }),
}));
