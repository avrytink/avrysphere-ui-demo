
import { create } from 'zustand';
import { AuthUIStore, User } from '../types';
import { useAuthStore } from './authStore';

export const useAuthUIStore = create<AuthUIStore>((set, get) => ({
  selectedUser: null,
  selectedOrgId: null,
  emailInput: '',
  passwordInput: '',
  isAddingAccount: false,
  isEntering: true,
  isSendingLink: false,
  linkSent: false,
  error: false,

  setSelectedUser: (user) => set({ selectedUser: user, isAddingAccount: false, passwordInput: '', error: false, selectedOrgId: null }),
  setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId, error: false }),
  setEmailInput: (email) => set({ emailInput: email, error: false }),
  setPasswordInput: (pass) => set({ passwordInput: pass, error: false }),
  setIsAddingAccount: (active) => set({ isAddingAccount: active, passwordInput: '', emailInput: '', error: false }),
  completeEntrance: () => set({ isEntering: false }),
  
  triggerError: () => {
    set({ error: true });
    setTimeout(() => set({ error: false }), 500);
  },

  requestMagicLink: async (user: User) => {
    if (get().isSendingLink) return;
    
    set({ isSendingLink: true });
    // Secure Handshake Simulation
    await new Promise(resolve => setTimeout(resolve, 1800));
    set({ isSendingLink: false, linkSent: true });

    setTimeout(() => {
      // Prioritize last active, fallback to default (first)
      const orgId = user.lastActiveOrgId || user.organizationIds[0];
      useAuthStore.getState().login(user, orgId);
      setTimeout(() => get().reset(), 500);
    }, 1200);
  },

  reset: () => set({
    emailInput: '',
    passwordInput: '',
    isSendingLink: false,
    linkSent: false,
    error: false,
    isAddingAccount: false,
    selectedUser: null,
    selectedOrgId: null
  })
}));
