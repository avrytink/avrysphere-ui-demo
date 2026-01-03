import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AppId,
  WindowState,
  WindowStore,
  Workspace,
  UserSession,
  SnapType,
  DesktopLayout,
  OSMode,
} from "../types";
import { APP_REGISTRY } from "../registry/AppRegistry";
import { useOSStore } from "./osStore";
import { useUserStore } from "./userStore";
import { useAuthStore } from "./authStore";
import { useSphereStore } from "./sphereStore";
import { useDockStore } from "./dockStore";

const generateId = () => Math.random().toString(36).substring(2, 11);

const getInitialWorkspaces = (): Workspace[] => [
  {
    id: "ws-main",
    name: "Main Workspace",
    background: "https://i.imgur.com/zJ4iCUp.jpeg",
  },
  {
    id: "ws-dev",
    name: "Second Workspace",
    background:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000",
  },
];

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: [],
      workspaces: getInitialWorkspaces(),
      activeWorkspaceId: "ws-main",
      activeInstanceId: null,
      sessions: {},
      snapPreview: null,

      _sync: () => {
        const state = get();
        const currentUser = useUserStore.getState().currentUser;
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!currentUser || !activeOrgId) return;
        const sessionKey = `${currentUser.id}:${activeOrgId}`;
        set((s) => ({
          sessions: {
            ...s.sessions,
            [sessionKey]: {
              windows: s.windows,
              workspaces: s.workspaces,
              activeWorkspaceId: s.activeWorkspaceId,
            },
          },
        }));
      },

      loadSession: (userId, orgId) => {
        const sessionKey = `${userId}:${orgId}`;
        const session = get().sessions[sessionKey];
        if (session) {
          set({
            windows: session.windows,
            workspaces: session.workspaces,
            activeWorkspaceId: session.activeWorkspaceId,
            activeInstanceId: null,
          });
        } else {
          const defaultWS = getInitialWorkspaces();
          set({
            windows: [],
            workspaces: defaultWS,
            activeWorkspaceId: defaultWS[0].id,
            activeInstanceId: null,
          });
        }
      },

      clearAllSessions: () =>
        set({
          windows: [],
          activeInstanceId: null,
          sessions: {},
          activeWorkspaceId: "ws-main",
        }),

      openWindow: (
        appId: AppId,
        forceNew = false,
        launchArgs?: Record<string, any>
      ) => {
        // 1. Intercept Mode Switches
        if ([AppId.DESKTOP_MODE, AppId.TV_MODE, AppId.TABLET_MODE, AppId.GAME_MODE].includes(appId)) {
          const sphereStore = useSphereStore.getState();
          const osStore = useOSStore.getState();
          const windowStore = useWindowStore.getState();

          // Perform cleanup before switch
          osStore.closeEverything();
          windowStore.minimizeAll();

          switch (appId) {
            case AppId.DESKTOP_MODE: sphereStore.setMode(OSMode.DESKTOP); break;
            case AppId.TV_MODE: sphereStore.setMode(OSMode.TV); break;
            case AppId.TABLET_MODE: sphereStore.setMode(OSMode.TABLET); break;
            case AppId.GAME_MODE: sphereStore.setMode(OSMode.GAMING); break;
          }
          return; // Exit early, no need to create a window
        }

        const appDef = APP_REGISTRY[appId];
        if (!appDef?.headless) {
          useOSStore.getState().closeAllOSPanels();
        }
        const state = get();
        const currentWS = state.activeWorkspaceId;
        if (!forceNew) {
          const appWindows = state.windows.filter(
            (w) =>
              w.appId === appId && w.workspaceId === currentWS && !w.parentId
          );
          if (appWindows.length > 0) {
            const mruWindow = [...appWindows].sort(
              (a, b) => b.zIndex - a.zIndex
            )[0];
            if (mruWindow) {
              if (launchArgs)
                set({
                  windows: state.windows.map((w) =>
                    w.instanceId === mruWindow.instanceId
                      ? { ...w, launchArgs: { ...w.launchArgs, ...launchArgs } }
                      : w
                  ),
                });
              if (mruWindow.isMinimized)
                set((s) => ({
                  windows: s.windows.map((w) =>
                    w.instanceId === mruWindow.instanceId
                      ? { ...w, isMinimized: false }
                      : w
                  ),
                }));
              get().focusWindow(mruWindow.instanceId);
            }
            return;
          }
        }
        const instanceId = generateId();
        const nextZ = Math.max(0, ...state.windows.map((w) => w.zIndex)) + 1;
        const width = 1000,
          height = 700;
        const x = (window.innerWidth - width) / 2,
          y = (window.innerHeight - height) / 2;

        const { layout, isMobile, isTablet, isTV } = useSphereStore.getState();
        const shouldMaximize =
          layout === DesktopLayout.UNITY || isMobile || isTablet || isTV;
        const TOP_BAR_HEIGHT = 32;
        const maximizedHeight =
          layout === DesktopLayout.UNITY
            ? window.innerHeight
            : window.innerHeight - 56;
        const maximizedPositionY =
          layout === DesktopLayout.UNITY ? 0 : TOP_BAR_HEIGHT - 8;

        const savedAppTheme = useAuthStore.getState().currentUser?.settings?.appThemes?.[appId];

        const newWindow: WindowState = {
          instanceId,
          appId,
          workspaceId: currentWS,
          title: appDef?.title || "New App",
          isOpen: true,
          isMaximized: shouldMaximize,
          isMinimized: false,
          zIndex: nextZ,
          x: shouldMaximize ? 0 : x,
          y: shouldMaximize ? maximizedPositionY : y,
          width: shouldMaximize ? "100%" : width,
          height: shouldMaximize ? maximizedHeight : height,
          prevX: x,
          prevY: y,
          prevWidth: width,
          prevHeight: height,
          scale: 1,
          theme: savedAppTheme,
          launchArgs,
        };
        set({
          windows: [...state.windows, newWindow],
          activeInstanceId: instanceId,
        });
        get().focusWindow(instanceId);
        get()._sync();
      },

      openChildWindow: (
        parentId: string,
        appId: AppId,
        config: {
          title?: string;
          width?: number;
          height?: number;
          modal?: boolean;
        } = {}
      ) => {
        const state = get();
        const parent = state.windows.find((w) => w.instanceId === parentId);
        if (!parent) return;
        const instanceId = generateId();
        const childWidth = config.width || 400,
          childHeight = config.height || 300;
        const centerX = parent.x + Number(parent.width) / 2 - childWidth / 2;
        const centerY = parent.y + Number(parent.height) / 2 - childHeight / 2;
        const newWindow: WindowState = {
          instanceId,
          appId,
          parentId,
          isModal: config.modal ?? true,
          workspaceId: parent.workspaceId,
          title: config.title || APP_REGISTRY[appId]?.title || "Sub Task",
          isOpen: true,
          isMaximized: false,
          isMinimized: false,
          zIndex: parent.zIndex + 1,
          x: centerX,
          y: centerY,
          width: childWidth,
          height: childHeight,
          scale: 1,
        };
        set({
          windows: [...state.windows, newWindow],
          activeInstanceId: instanceId,
        });
        get().focusWindow(instanceId);
        get()._sync();
      },

      closeWindow: (instanceId) => {
        set((state) => {
          const findChildren = (id: string): string[] => {
            const children = state.windows
              .filter((w) => w.parentId === id)
              .map((w) => w.instanceId);
            return [...children, ...children.flatMap(findChildren)];
          };
          const toRemove = [instanceId, ...findChildren(instanceId)];
          return {
            windows: state.windows.filter(
              (w) => !toRemove.includes(w.instanceId)
            ),
            activeInstanceId: toRemove.includes(state.activeInstanceId || "")
              ? null
              : state.activeInstanceId,
          };
        });
        get()._sync();
      },

      minimizeWindow: (instanceId) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.instanceId === instanceId ? { ...w, isMinimized: true } : w
          ),
          activeInstanceId:
            state.activeInstanceId === instanceId
              ? null
              : state.activeInstanceId,
        }));
        get()._sync();
      },

      maximizeWindow: (instanceId) => {
        const { layout } = useSphereStore.getState();
        const { dockCollapsed } = useDockStore.getState();
        const TOP_BAR_HEIGHT = 32;
        const DOCK_WIDTH =
          layout === DesktopLayout.UNITY ? (dockCollapsed ? 48 : 80) : 0;

        const maximizedHeight =
          layout === DesktopLayout.UNITY
            ? window.innerHeight
            : window.innerHeight - 56;
        const maximizedPositionY =
          layout === DesktopLayout.UNITY ? 0 : TOP_BAR_HEIGHT - 8;

        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.instanceId === instanceId) {
              const isMax = w.isMaximized;
              return {
                ...w,
                isMaximized: !isMax,
                prevX: !isMax ? w.x : w.prevX,
                prevY: !isMax ? w.y : w.prevY,
                prevWidth: !isMax ? w.width : w.prevWidth,
                prevHeight: !isMax ? w.height : w.prevHeight,
                x: isMax ? w.prevX ?? 0 : 0,
                y: isMax ? w.prevY ?? maximizedPositionY : maximizedPositionY,
                width: isMax ? w.prevWidth ?? "100%" : "100%",
                height: isMax ? w.prevHeight ?? maximizedHeight : maximizedHeight,
              };
            }
            return w;
          }),
        }));
        get().focusWindow(instanceId);
        get()._sync();
      },

      snapWindow: (instanceId, snap) => {
        const { layout } = useSphereStore.getState();
        const { dockCollapsed } = useDockStore.getState();
        const TOP_BAR_HEIGHT = 32;
        const DOCK_WIDTH =
          layout === DesktopLayout.UNITY ? (dockCollapsed ? 48 : 80) : 0;
        const usableWidth = window.innerWidth - DOCK_WIDTH;
        const fullHeight =
          layout === DesktopLayout.UNITY
            ? window.innerHeight
            : window.innerHeight - 56;
        const halfHeight = fullHeight / 2;
        const topPositionY =
          layout === DesktopLayout.UNITY ? 0 : TOP_BAR_HEIGHT - 8;

        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.instanceId === instanceId) {
              const prev = {
                prevX: w.prevX ?? w.x,
                prevY: w.prevY ?? w.y,
                prevWidth: w.prevWidth ?? w.width,
                prevHeight: w.prevHeight ?? w.height,
              };
              let updates: Partial<WindowState> = { isMaximized: false };
              switch (snap) {
                case SnapType.FULL:
                  updates = {
                    isMaximized: true,
                    x: 0,
                    y: topPositionY,
                    width: "100%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.LEFT:
                  updates = {
                    x: 0,
                    y: topPositionY,
                    width: "50%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.RIGHT:
                  updates = {
                    x: usableWidth / 2,
                    y: topPositionY,
                    width: "50%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.TOP_LEFT:
                  updates = {
                    x: 0,
                    y: topPositionY,
                    width: "50%",
                    height: halfHeight,
                  };
                  break;
                case SnapType.TOP_RIGHT:
                  updates = {
                    x: usableWidth / 2,
                    y: topPositionY,
                    width: "50%",
                    height: halfHeight,
                  };
                  break;
                case SnapType.BOTTOM_LEFT:
                  updates = {
                    x: 0,
                    y: topPositionY + halfHeight,
                    width: "50%",
                    height: halfHeight,
                  };
                  break;
                case SnapType.BOTTOM_RIGHT:
                  updates = {
                    x: usableWidth / 2,
                    y: topPositionY + halfHeight,
                    width: "50%",
                    height: halfHeight,
                  };
                  break;

                case SnapType.LEFT_TWO_THIRDS:
                  updates = {
                    x: 0,
                    y: topPositionY,
                    width: "66.66%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.RIGHT_ONE_THIRD:
                  updates = {
                    x: usableWidth * 0.6666,
                    y: topPositionY,
                    width: "33.33%",
                    height: fullHeight,
                  };
                  break;

                case SnapType.THIRD_LEFT:
                  updates = {
                    x: 0,
                    y: topPositionY,
                    width: "33.33%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.THIRD_CENTER:
                  updates = {
                    x: usableWidth * 0.3333,
                    y: topPositionY,
                    width: "33.33%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.THIRD_RIGHT:
                  updates = {
                    x: usableWidth * 0.6666,
                    y: topPositionY,
                    width: "33.33%",
                    height: fullHeight,
                  };
                  break;

                case SnapType.COL3_L25:
                  updates = {
                    x: 0,
                    y: topPositionY,
                    width: "25%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.COL3_C50:
                  updates = {
                    x: usableWidth * 0.25,
                    y: topPositionY,
                    width: "50%",
                    height: fullHeight,
                  };
                  break;
                case SnapType.COL3_R25:
                  updates = {
                    x: usableWidth * 0.75,
                    y: topPositionY,
                    width: "25%",
                    height: fullHeight,
                  };
                  break;

                default:
                  return w;
              }
              return { ...w, ...prev, ...updates };
            }
            return w;
          }),
        }));
        get().focusWindow(instanceId);
        get()._sync();
      },

      focusWindow: (instanceId) => {
        const state = get();
        if (state.activeInstanceId === instanceId) return;

        const findRoot = (id: string): string => {
          const win = state.windows.find((w) => w.instanceId === id);
          return win?.parentId ? findRoot(win.parentId) : id;
        };

        const rootId = findRoot(instanceId);
        
        // Find all descendants recursively
        const getDescendants = (id: string): string[] => {
          const children = state.windows.filter((w) => w.parentId === id);
          return [
            ...children.map((c) => c.instanceId),
            ...children.flatMap((c) => getDescendants(c.instanceId)),
          ];
        };

        const familyIds = [rootId, ...getDescendants(rootId)];
        const nextZ = Math.max(0, ...state.windows.map((w) => w.zIndex)) + 1;

        set({
          windows: state.windows.map((w) => {
            if (familyIds.includes(w.instanceId)) {
              // Modals should always stay above their parents
              const depth = (id: string, d = 0): number => {
                const win = state.windows.find((window) => window.instanceId === id);
                return win?.parentId ? depth(win.parentId, d + 1) : d;
              };
              return {
                ...w,
                zIndex: nextZ + depth(w.instanceId),
                isMinimized: false,
              };
            }
            return w;
          }),
          activeInstanceId: instanceId,
        });
        get()._sync();
      },

      blurWindows: () => set({ activeInstanceId: null }),
      minimizeAll: () =>
        set((state) => ({
          windows: state.windows.map((w) => ({ ...w, isMinimized: true })),
          activeInstanceId: null,
        })),
      updateWindowPosition: (id, x, y) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.instanceId === id ? { ...w, x, y } : w
          ),
        })),
      updateWindowSize: (id, width, height) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.instanceId === id ? { ...w, width, height } : w
          ),
        })),
      updateWindowScale: (id, scale) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.instanceId === id ? { ...w, scale } : w
          ),
        })),
      updateWindowPreview: (id, preview) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.instanceId === id ? { ...w, preview } : w
          ),
        })),
      setWindowTheme: (id, theme) => {
        const window = get().windows.find(w => w.instanceId === id);
        if (window) {
          // 1. Update active window instance
          set((s) => ({
            windows: s.windows.map((w) =>
              w.instanceId === id ? { ...w, theme } : w
            ),
          }));

          // 2. Persist to User Profile for all future instances of this app
          const { currentUser, updateUser } = useAuthStore.getState();
          if (currentUser) {
            const currentAppThemes = currentUser.settings?.appThemes || {};
            const newAppThemes = { ...currentAppThemes };
            
            if (theme === undefined) {
              delete newAppThemes[window.appId];
            } else {
              newAppThemes[window.appId] = theme;
            }

            updateUser({
              settings: {
                ...currentUser.settings,
                appThemes: newAppThemes,
              } as any
            });
          }
        }
      },
      setSnapPreview: (snapPreview) => set({ snapPreview }),
      setActiveWorkspace: (id) =>
        set({ activeWorkspaceId: id, activeInstanceId: null }),
      addWorkspace: () =>
        set((s) => ({
          workspaces: [
            ...s.workspaces,
            {
              id: generateId(),
              name: `Workspace ${s.workspaces.length + 1}`,
              background:
                "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000",
            },
          ],
        })),
      removeWorkspace: (id) =>
        set((s) => {
          if (s.workspaces.length <= 1) return s;
          const nws = s.workspaces.filter((ws) => ws.id !== id);
          return {
            workspaces: nws,
            activeWorkspaceId:
              s.activeWorkspaceId === id ? nws[0].id : s.activeWorkspaceId,
            windows: s.windows.filter((w) => w.workspaceId !== id),
          };
        }),
      renameWorkspace: (id, name) =>
        set((s) => ({
          workspaces: s.workspaces.map((ws) =>
            ws.id === id ? { ...ws, name } : ws
          ),
        })),
      updateWorkspaceBackground: (id, bg) =>
        set((s) => ({
          workspaces: s.workspaces.map((ws) =>
            ws.id === id ? { ...ws, background: bg } : ws
          ),
        })),
    }),
    {
      name: "avry-window-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
