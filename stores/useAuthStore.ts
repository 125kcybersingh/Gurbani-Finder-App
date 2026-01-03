/**
 * Authentication store
 * Manages user authentication state with Supabase
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/database/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      initialized: false,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),

      signIn: async (email, password) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ loading: false });
            return { error };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return { error: null };
        } catch (error) {
          set({ loading: false });
          return { error: error as Error };
        }
      },

      signUp: async (email, password) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            set({ loading: false });
            return { error };
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return { error: null };
        } catch (error) {
          set({ loading: false });
          return { error: error as Error };
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            session: null,
            loading: false,
          });
        } catch (error) {
          console.error('Sign out error:', error);
          set({ loading: false });
        }
      },

      initialize: async () => {
        if (get().initialized) return;

        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({
            session,
            user: session?.user ?? null,
            initialized: true,
            loading: false,
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              session,
              user: session?.user ?? null,
            });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ loading: false, initialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

