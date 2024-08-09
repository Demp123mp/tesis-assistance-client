// store/authStore.ts
import { authUser } from '@/api/auth/auth.api';
import { IUser } from '@/models/user.model';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
  token: string | null;
  user: IUser | null;
  error: string | null;
  login: (token: string, user: IUser) => void
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      error: null,
      login: async (token: string, user: IUser) => {
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, error: null });
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);
