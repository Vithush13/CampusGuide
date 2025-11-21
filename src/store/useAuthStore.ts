import { create } from "zustand";

interface User {
  name: string;
  email: string;
  password?: string; // store password securely in memory
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password?: string, avatar?: string) => void;
  register: (name: string, email: string, password: string, avatar?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (email, password, avatar) =>
    set({ user: { name: email.split("@")[0], email, password, avatar } }),

  register: (name, email, password, avatar) =>
    set({ user: { name, email, password, avatar } }),

  logout: () => set({ user: null }),
}));
