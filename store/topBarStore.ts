
import { create } from 'zustand';
import { TopBarStore } from '../types';

export const useTopBarStore = create<TopBarStore>((set) => ({
  dateTime: new Date(),
  updateDateTime: () => set({ dateTime: new Date() }),
}));
