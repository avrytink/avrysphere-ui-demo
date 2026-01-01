
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore, User, DesktopLayout } from '../types';
import { useUserStore } from './userStore';
import { useOSStore } from './osStore';
import { useSphereStore } from './sphereStore';
import { useDockStore } from './dockStore';
import { useWindowStore } from './windowStore';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLocked: false,
      currentUser: null,
      activeOrgId: null,
      loggedInUsers: [],
      
      login: (user: User, orgId?: string) => {
        const { loggedInUsers } = get();
        
        // Determine correct org: explicitly passed > last used > default (first in list)
        const targetOrgId = orgId || user.lastActiveOrgId || user.organizationIds[0];

        // Ensure we update the user object with the target Org ID as the active one
        const updatedUserObj = { ...user, lastActiveOrgId: targetOrgId };

        const isAlreadyLoggedIn = loggedInUsers.some(u => u.id === user.id);
        const updatedUsers = isAlreadyLoggedIn 
          ? loggedInUsers.map(u => u.id === user.id ? updatedUserObj : u)
          : [...loggedInUsers, updatedUserObj];

        // 1. Set Auth State
        set({ 
          isAuthenticated: true, 
          isLocked: false, 
          currentUser: updatedUserObj,
          activeOrgId: targetOrgId,
          loggedInUsers: updatedUsers
        });
        
        // 2. Sync to stores
        useUserStore.getState().setCurrentUser(updatedUserObj);
        useUserStore.getState().updateUser(user.id, { lastActiveOrgId: targetOrgId });

        // Load session scoped by User AND Org
        useWindowStore.getState().loadSession(user.id, targetOrgId);
        
        const osStore = useOSStore.getState();
        const sphereStore = useSphereStore.getState();
        const dockStore = useDockStore.getState();
        
        osStore.setSettings({
          theme: user.settings?.theme ?? osStore.theme,
          accentColor: user.settings?.accentColor ?? osStore.accentColor,
          brightness: user.settings?.brightness ?? osStore.brightness,
          volume: user.settings?.volume ?? osStore.volume,
        });
        
        sphereStore.setLayout(user.settings?.layout ?? sphereStore.layout);
        
        dockStore.setDockCollapsed(user.settings?.dockCollapsed ?? dockStore.dockCollapsed);
        osStore.closeAllOSPanels();
      },

      switchAccount: (userId: string, orgId: string) => {
        const { loggedInUsers, currentUser } = get();
        // Save current session before switching
        if (currentUser) {
          useWindowStore.getState()._sync();
        }
        
        const targetUser = loggedInUsers.find(u => u.id === userId);
        if (targetUser) {
          get().login(targetUser, orgId);
        }
      },

      switchOrganization: (orgId: string) => {
        const { currentUser, loggedInUsers } = get();
        if (!currentUser) return;

        // Save current session
        useWindowStore.getState()._sync();

        // Update persistence
        const updatedUser = { ...currentUser, lastActiveOrgId: orgId };
        const updatedLoggedInUsers = loggedInUsers.map(u => 
          u.id === currentUser.id ? updatedUser : u
        );

        // Update active org and load new session
        set({ 
          activeOrgId: orgId, 
          currentUser: updatedUser,
          loggedInUsers: updatedLoggedInUsers
        });

        useUserStore.getState().setCurrentUser(updatedUser);
        useUserStore.getState().updateUser(currentUser.id, { lastActiveOrgId: orgId });

        useWindowStore.getState().loadSession(currentUser.id, orgId);
        
        // Close overlays
        useOSStore.getState().closeAllOSPanels();
      },

      logout: (userId?: string) => {
        const { currentUser, loggedInUsers, activeOrgId } = get();
        const idToLogout = userId || currentUser?.id;
        
        const remainingUsers = loggedInUsers.filter(u => u.id !== idToLogout);
        
        if (remainingUsers.length === 0) {
          set({ isAuthenticated: false, isLocked: false, currentUser: null, activeOrgId: null, loggedInUsers: [] });
          useUserStore.getState().setCurrentUser(null);
          useWindowStore.getState().clearAllSessions();
        } else {
          const nextUser = remainingUsers[0];
          // Default to last active org or first org for next user
          const nextOrgId = nextUser.lastActiveOrgId || nextUser.organizationIds[0];
          
          set({ 
            loggedInUsers: remainingUsers,
            currentUser: nextUser,
            activeOrgId: nextOrgId,
            isAuthenticated: userId ? get().isAuthenticated : false // If logging out self, go to auth screen
          });
          
          if (!userId || userId === currentUser?.id) {
             useWindowStore.getState().loadSession(nextUser.id, nextOrgId);
          }
        }
        useOSStore.getState().closeAllOSPanels();
      },

      lockSession: () => {
        set({ isLocked: true });
        useOSStore.getState().closeAllOSPanels();
      },

      unlockSession: () => {
        set({ isLocked: false });
      },

      powerDown: () => {
        set({ isAuthenticated: false, isLocked: false, currentUser: null, activeOrgId: null, loggedInUsers: [] });
        useUserStore.getState().setCurrentUser(null);
        useWindowStore.getState().clearAllSessions();
        useOSStore.getState().closeEverything();
      },

      updateUser: (updates: Partial<User>) => {
        const { currentUser, loggedInUsers } = get();
        if (!currentUser) return;

        const updatedUser = { 
          ...currentUser, 
          ...updates,
          settings: {
            ...currentUser.settings,
            ...(updates.settings || {})
          } as User['settings']
        };

        const updatedLoggedInUsers = loggedInUsers.map(u => 
          u.id === currentUser.id ? updatedUser : u
        );

        set({
          currentUser: updatedUser,
          loggedInUsers: updatedLoggedInUsers
        });

        // Sync with UserStore generic database for consistency
        useUserStore.getState().updateUser(currentUser.id, updates);
      }
    }),
    {
      name: 'avry-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        loggedInUsers: state.loggedInUsers, 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        activeOrgId: state.activeOrgId,
        isLocked: state.isAuthenticated // Always lock on refresh for security
      }),
    }
  )
);
