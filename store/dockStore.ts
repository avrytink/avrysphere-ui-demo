import { create } from 'zustand';
import { DockStore } from '../types';
import { useOSStore } from './osStore';

export const useDockStore = create<DockStore>((set) => ({
  dockCollapsed: false,
  launcherOpen: false,
  geminiPanelOpen: false,
  notificationsOpen: false,
  profileOpen: false,
  workspacePanelOpen: false,
  launcherSearchQuery: '',

  setDockCollapsed: (collapsed) => set({ dockCollapsed: collapsed }),
  setLauncherOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({ launcherOpen: open, geminiPanelOpen: false, notificationsOpen: false, profileOpen: false, workspacePanelOpen: false });
  },
  setGeminiPanelOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({ geminiPanelOpen: open, launcherOpen: false, notificationsOpen: false, profileOpen: false, workspacePanelOpen: false });
  },
  setNotificationsOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({ notificationsOpen: open, launcherOpen: false, geminiPanelOpen: false, profileOpen: false, workspacePanelOpen: false });
  },
  setProfileOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({ profileOpen: open, launcherOpen: false, geminiPanelOpen: false, notificationsOpen: false, workspacePanelOpen: false });
  },
  setWorkspacePanelOpen: (open) => {
    if (open) useOSStore.getState().closeAllOSPanels();
    set({ workspacePanelOpen: open, launcherOpen: false, geminiPanelOpen: false, notificationsOpen: false, profileOpen: false });
  },
  setLauncherSearchQuery: (query) => set({ launcherSearchQuery: query }),

  toggleLauncher: () => set((s) => {
    const next = !s.launcherOpen;
    if (next) useOSStore.getState().closeAllOSPanels();
    return { launcherOpen: next, geminiPanelOpen: false, notificationsOpen: false, profileOpen: false, workspacePanelOpen: false };
  }),
  toggleGeminiPanel: () => set((s) => {
    const next = !s.geminiPanelOpen;
    if (next) useOSStore.getState().closeAllOSPanels();
    return { geminiPanelOpen: next, launcherOpen: false, notificationsOpen: false, profileOpen: false, workspacePanelOpen: false };
  }),
  toggleNotifications: () => set((s) => {
    const next = !s.notificationsOpen;
    if (next) useOSStore.getState().closeAllOSPanels();
    return { notificationsOpen: next, launcherOpen: false, geminiPanelOpen: false, profileOpen: false, workspacePanelOpen: false };
  }),
  toggleProfile: () => set((s) => {
    const next = !s.profileOpen;
    if (next) useOSStore.getState().closeAllOSPanels();
    return { profileOpen: next, launcherOpen: false, geminiPanelOpen: false, notificationsOpen: false, workspacePanelOpen: false };
  }),
  toggleWorkspacePanel: () => set((s) => {
    const next = !s.workspacePanelOpen;
    if (next) useOSStore.getState().closeAllOSPanels();
    return { workspacePanelOpen: next, launcherOpen: false, geminiPanelOpen: false, notificationsOpen: false, profileOpen: false };
  }),

  closeAllDockPanels: () => set({ 
    launcherOpen: false, 
    geminiPanelOpen: false, 
    notificationsOpen: false, 
    profileOpen: false, 
    workspacePanelOpen: false 
  }),
}));