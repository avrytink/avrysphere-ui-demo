
import { create } from 'zustand';
import { SphereState, DesktopLayout } from '../types';

export const useSphereStore = create<SphereState>((set) => ({
  isMobile: false,
  isTablet: false,
  isTV: false,
  isGaming: false,
  layout: DesktopLayout.AVRY,

  setIsMobile: (isMobile) => set({ isMobile }),
  setIsTablet: (isTablet) => set({ isTablet }),
  setIsTV: (isTV) => set({ isTV }),
  setIsGaming: (isGaming) => set({ isGaming }),
  setLayout: (layout) => set({ layout }),
}));
