'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseInitialized } from '../lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInAsGuest: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. If Supabase is NOT initialized, we check for a mock session
    if (!isSupabaseInitialized) {
      const mockUser = localStorage.getItem('nova_mock_user');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }

    // 2. If Supabase IS initialized, use Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Simple Auth Protection logic
  useEffect(() => {
    if (loading) return;

    const publicPages = ['/login'];
    const isPublicPage = publicPages.includes(pathname);

    if (!user && !isPublicPage) {
      router.push('/login');
    } else if (user && isPublicPage) {
      router.push('/library');
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    if (isSupabaseInitialized) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('nova_mock_user');
    setUser(null);
    router.push('/login');
  };

  const signInAsGuest = () => {
    const guestUser = {
      id: 'guest_user_id',
      email: 'guest@example.com',
      user_metadata: { full_name: 'Guest Designer' },
    } as any;
    localStorage.setItem('nova_mock_user', JSON.stringify(guestUser));
    setUser(guestUser);
    router.push('/library');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
