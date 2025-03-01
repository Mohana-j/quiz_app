import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null, // Stores the logged-in user (admin or regular user)
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
