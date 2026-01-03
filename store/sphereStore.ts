import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereState, DesktopLayout, OSMode } from '../types';

export const useSphereStore = create<SphereState>()(
  persist(
    (set) => ({
      mode: OSMode.DESKTOP,
      isMobile: false,
      isTablet: false,
      isTV: false,
      isGaming: false,
      layout: DesktopLayout.AVRY,
      manualMode: false,

      setIsMobile: (isMobile) => set({ 
        isMobile, 
        mode: isMobile ? OSMode.MOBILE : OSMode.DESKTOP,
        manualMode: false 
      }),
      setIsTablet: (isTablet) => set({ 
        isTablet, 
        mode: isTablet ? OSMode.TABLET : OSMode.DESKTOP,
        manualMode: false 
      }),
      setIsTV: (isTV) => set({ 
        isTV, 
        mode: isTV ? OSMode.TV : OSMode.DESKTOP,
        manualMode: false 
      }),
      setIsGaming: (isGaming) => set({ 
        isGaming, 
        mode: isGaming ? OSMode.GAMING : OSMode.DESKTOP,
        manualMode: false 
      }),
      
      setMode: (mode) => {
        set({
          mode,
          isMobile: mode === OSMode.MOBILE,
          isTablet: mode === OSMode.TABLET,
          isTV: mode === OSMode.TV,
          isGaming: mode === OSMode.GAMING,
          manualMode: true,
        });
      },

      setLayout: (layout) => {
        set({ layout });
      },
    }),
    {
      name: 'avry-sphere-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);