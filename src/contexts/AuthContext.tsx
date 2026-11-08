'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { WebUser } from '../types/auth';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  user: WebUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<AuthResult>;
  verifyRegistration: (email: string, code: string) => Promise<AuthResult>;
  resendRegistrationCode: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isWebUser(value: unknown): value is WebUser {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'initials' in value &&
    typeof value.initials === 'string' &&
    'createdAt' in value &&
    typeof value.createdAt === 'string'
  );
}

async function postAuthRequest(
  path: string,
  payload?: Record<string, unknown>
): Promise<{ response: Response; body: unknown }> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error('The server returned an invalid response.');
  }
  return { response, body };
}

function getErrorMessage(body: unknown): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof body.error === 'string'
  ) {
    return body.error;
  }
  return 'The request could not be completed. Please try again.';
}

function getResponseUser(body: unknown): WebUser {
  if (
    typeof body !== 'object' ||
    body === null ||
    !('user' in body) ||
    !isWebUser(body.user)
  ) {
    throw new Error('The server did not return a valid user profile.');
  }
  return body.user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WebUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then(async (response) => {
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(body));
        if (
          typeof body !== 'object' ||
          body === null ||
          !('user' in body) ||
          (body.user !== null && !isWebUser(body.user))
        ) {
          throw new Error('The server returned an invalid session.');
        }
        if (active) setUser(body.user);
      })
      .catch((error: unknown) => {
        if (active) {
          setUser(null);
          console.error('Unable to restore the authentication session:', error);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<AuthResult> => {
    if (!email.trim() || !password) {
      return { ok: false, error: 'Please provide both email and password.' };
    }

    try {
      const { response, body } = await postAuthRequest('login', {
        email: email.trim(),
        password,
        rememberMe,
      });
      if (!response.ok) return { ok: false, error: getErrorMessage(body) };
      setUser(getResponseUser(body));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to sign in.',
      };
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResult> => {
    try {
      const { response, body } = await postAuthRequest('register', {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      return response.ok
        ? { ok: true }
        : { ok: false, error: getErrorMessage(body) };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to register.',
      };
    }
  }, []);

  const verifyRegistration = useCallback(async (
    email: string,
    code: string
  ): Promise<AuthResult> => {
    try {
      const { response, body } = await postAuthRequest('verify-registration', {
        email: email.trim(),
        verifyCode: code,
      });
      if (!response.ok) return { ok: false, error: getErrorMessage(body) };
      setUser(getResponseUser(body));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to verify your account.',
      };
    }
  }, []);

  const resendRegistrationCode = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const { response, body } = await postAuthRequest('resend-registration-code', {
        email: email.trim(),
      });
      return response.ok
        ? { ok: true }
        : { ok: false, error: getErrorMessage(body) };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to resend the code.',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error('The server could not end the session.');
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        verifyRegistration,
        resendRegistrationCode,
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
