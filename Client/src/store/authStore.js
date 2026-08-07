import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  token: null,
  setUser: (user, token) => set({ user, token, isLoggedIn: !!user }),
  logout: () => set({ user: null, token: null, isLoggedIn: false }),
}));

export default useAuthStore;