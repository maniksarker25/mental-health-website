'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { WebUser } from '../types/auth';

interface AuthContextType {
  user: WebUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mention_health_web_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WebUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { ok: false, error: 'Please provide both email and password.' };
    }

    // Generate user initials and name from email or stored profile
    const namePart = email.split('@')[0] || 'Member';
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const initials = formattedName.slice(0, 2).toUpperCase();

    const loggedUser: WebUser = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email: email.trim().toLowerCase(),
      initials,
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    } catch {
      // ignore
    }

    return { ok: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      return { ok: false, error: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters long.' };
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || 'U';

    const newUser: WebUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      initials,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }

    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
