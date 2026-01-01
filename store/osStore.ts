
import { create } from 'zustand';
import { OSState, AppId } from '../types';
import { useDockStore } from './dockStore';
import { useWindowStore } from './windowStore';
import { useMediaStore } from './mediaStore';
import { useAuthStore } from './authStore';

export const useOSStore = create<OSState>((set, get) => ({
  theme: 'dark',
  accentColor: '#3B82F6',
  glassOpacity: 0.7,
  wifiEnabled: true,
  bluetoothEnabled: true,
  volume: 65,
  brightness: 80,
  batteryLevel: 1,
  isCharging: false,
  inactivityTimeout: 10,
  spotlightOpen: false,
  controlCenterOpen: false,
  calendarOverlayOpen: false,
  accountSwitcherOpen: false,
  membersPanelOpen: false,
  switcherOpen: false,
  switcherIndex: 0,

  setTheme: (theme) => {
    set({ theme });
    // Sync with User Profile
    useAuthStore.getState().updateUser({ settings: { ...useAuthStore.getState().currentUser?.settings, theme } as any });
  },
  
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setBatteryStatus: (level, charging) => set({ batteryLevel: level, isCharging: charging }),
  
  setSettings: (newSettings) => {
    set((state) => ({ ...state, ...newSettings }));
    // Persist critical settings to user profile
    const currentUser = useAuthStore.getState().currentUser;
    if (currentUser) {
      useAuthStore.getState().updateUser({ 
        settings: { 
          ...currentUser.settings, 
          ...newSettings 
        } as any 
      });
    }
  },

  setSpotlightOpen: (open) => {
    if (open) useDockStore.getState().closeAllDockPanels();
    set({ spotlightOpen: open, controlCenterOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false, membersPanelOpen: false });
  },
  setControlCenterOpen: (open) => {
    if (open) useDockStore.getState().closeAllDockPanels();
    set({ controlCenterOpen: open, spotlightOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false, membersPanelOpen: false });
  },
  // Fixed: Removed duplicate 'calendarOverlayOpen' property in object literal and added missing 'accountSwitcherOpen'
  setCalendarOverlayOpen: (open) => {
    if (open) useDockStore.getState().closeAllDockPanels();
    set({ calendarOverlayOpen: open, spotlightOpen: false, controlCenterOpen: false, accountSwitcherOpen: false, membersPanelOpen: false });
  },
  setAccountSwitcherOpen: (open) => {
    if (open) useDockStore.getState().closeAllDockPanels();
    set({ accountSwitcherOpen: open, spotlightOpen: false, controlCenterOpen: false, calendarOverlayOpen: false, membersPanelOpen: false });
  },
  setMembersPanelOpen: (open) => {
    if (open) useDockStore.getState().closeAllDockPanels();
    set({ membersPanelOpen: open, spotlightOpen: false, controlCenterOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false });
  },
  setSwitcherOpen: (open) => set({ switcherOpen: open }),
  setSwitcherIndex: (index) => set({ switcherIndex: index }),

  toggleSpotlight: () => set((s) => {
    const next = !s.spotlightOpen;
    if (next) useDockStore.getState().closeAllDockPanels();
    return { spotlightOpen: next, controlCenterOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false, membersPanelOpen: false };
  }),
  toggleControlCenter: () => set((s) => {
    const next = !s.controlCenterOpen;
    if (next) useDockStore.getState().closeAllDockPanels();
    return { controlCenterOpen: next, spotlightOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false, membersPanelOpen: false };
  }),
  toggleCalendarOverlay: () => set((s) => {
    const next = !s.calendarOverlayOpen;
    if (next) useDockStore.getState().closeAllDockPanels();
    return { calendarOverlayOpen: next, spotlightOpen: false, controlCenterOpen: false, accountSwitcherOpen: false, membersPanelOpen: false };
  }),
  toggleAccountSwitcher: () => set((s) => {
    const next = !s.accountSwitcherOpen;
    if (next) useDockStore.getState().closeAllDockPanels();
    return { accountSwitcherOpen: next, spotlightOpen: false, controlCenterOpen: false, calendarOverlayOpen: false, membersPanelOpen: false };
  }),
  toggleMembersPanel: () => set((s) => {
    const next = !s.membersPanelOpen;
    if (next) useDockStore.getState().closeAllDockPanels();
    return { membersPanelOpen: next, spotlightOpen: false, controlCenterOpen: false, calendarOverlayOpen: false, accountSwitcherOpen: false };
  }),

  closeAllOSPanels: () => set({ 
    spotlightOpen: false, 
    controlCenterOpen: false, 
    calendarOverlayOpen: false, 
    accountSwitcherOpen: false,
    membersPanelOpen: false,
    switcherOpen: false
  }),

  closeEverything: () => {
    useDockStore.getState().closeAllDockPanels();
    get().closeAllOSPanels();
  },

  launchUrl: (url: string) => {
    if (!url.startsWith('avry://')) return;
    const windowStore = useWindowStore.getState();
    const mediaStore = useMediaStore.getState();
    const dockStore = useDockStore.getState();
    set({ spotlightOpen: false });
    const cleanUrl = url.replace('avry://', '');
    const [pathWithArgs, queryParams] = cleanUrl.split('?');
    const [target, ...subPathParts] = pathWithArgs.split('/');
    const subPath = subPathParts.join('/');
    const params = new URLSearchParams(queryParams);
    const args: Record<string, string> = {};
    params.forEach((value, key) => { args[key] = value; });
    switch (target.toLowerCase()) {
      case 'settings':
        windowStore.openWindow(AppId.SETTINGS, false, { tab: subPath.toUpperCase(), ...args });
        break;
      case 'music':
        windowStore.openWindow(AppId.MUSIC, false, { ...args });
        if (subPath === 'play') mediaStore.setPlaying(true);
        if (subPath === 'pause') mediaStore.setPlaying(false);
        if (subPath === 'next') mediaStore.nextTrack();
        if (subPath === 'prev') mediaStore.prevTrack();
        break;
      case 'ai':
        dockStore.setGeminiPanelOpen(true);
        break;
      case 'browser':
        windowStore.openWindow(AppId.BROWSER, false, { url: args.url || 'https://www.bing.com' });
        break;
      case 'store':
      case 'shopper':
        windowStore.openWindow(AppId.SHOPPER);
        break;
      case 'files':
        windowStore.openWindow(AppId.FILES, false, { path: subPath });
        break;
      case 'terminal':
        windowStore.openWindow(AppId.TERMINAL);
        break;
      default:
        console.warn(`Unknown protocol target: ${target}`);
        break;
    }
  }
}));
