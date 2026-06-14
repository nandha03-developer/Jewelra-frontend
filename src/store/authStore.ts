'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  image?: string;
  profileImage?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null; // Added Refresh Token support
  isNewUser: boolean; // Track if user is newly signed up
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void; // Added Refresh Token setter
  setIsNewUser: (isNew: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isNewUser: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setIsNewUser: (isNew) => set({ isNewUser: isNew }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jewelra_token');
          localStorage.removeItem('jewelra_user');
          localStorage.removeItem('jewelra_refresh');
          localStorage.removeItem('jewelra_new_user');
        }
        set({ user: null, token: null, refreshToken: null, isNewUser: false });
      },
    }),
    {
      name: 'jewelra-auth',
    }
  )
);
