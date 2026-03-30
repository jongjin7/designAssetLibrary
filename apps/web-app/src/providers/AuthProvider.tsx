'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseInitialized } from '../lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  /** OAuth 로그인(Google, GitHub 등) 여부 */
  isOAuth: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  /** 표시 이름 변경. OAuth 재로그인 시 provider 값으로 덮어쓰일 수 있음 */
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isOAuth: false,
  signOut: async () => {},
  signInAsGuest: () => {},
  updateDisplayName: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const profile = useMemo<UserProfile | null>(() => {
    if (!user) return null;
    const meta = user.user_metadata || {};
    return {
      name: meta.full_name || meta.name || meta.user_name || meta.nickname || meta.display_name || '사용자',
      email: user.email || '',
      avatarUrl: meta.avatar_url || meta.picture || meta.profile_image || null,
    };
  }, [user]);

  // app_metadata.provider가 'email'이 아니면 OAuth 로그인
  const isOAuth = useMemo(() => {
    if (!user) return false;
    const provider = user.app_metadata?.provider;
    return !!provider && provider !== 'email';
  }, [user]);

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

  const updateDisplayName = async (name: string) => {
    if (!user) return;

    if (isSupabaseInitialized) {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });
      if (error) throw error;
      if (data.user) setUser(data.user);
    } else {
      // mock 모드: localStorage 갱신
      const updated = {
        ...user,
        user_metadata: { ...user.user_metadata, full_name: name },
      };
      localStorage.setItem('nova_mock_user', JSON.stringify(updated));
      setUser(updated as User);
    }
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
    <AuthContext.Provider value={{ user, profile, loading, isOAuth, signOut, signInAsGuest, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
