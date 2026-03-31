'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthService } from '@/services/api/auth.service';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
} from '@/lib/storage';
import type {
  AuthSession,
  AuthenticatedUser,
  SignInPayload,
  SignUpPayload,
  UserResponse,
} from '@/types/auth';

type AuthContextValue = {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (payload: SignInPayload) => Promise<AuthSession>;
  signUp: (payload: SignUpPayload) => Promise<UserResponse>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    function handleExpiredSession() {
      setToken(null);
      setUser(null);
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);

    const initializeSession = window.setTimeout(() => {
      const storedToken = getAccessToken();
      const storedUser = getStoredAuthUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else if (storedToken && !storedUser) {
        clearAuthSession();
      }

      setIsInitializing(false);
    }, 0);

    return () => {
      window.clearTimeout(initializeSession);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    };
  }, []);

  async function signIn(payload: SignInPayload): Promise<AuthSession> {
    const session = await AuthService.signIn(payload);
    setToken(session.access_token);
    setUser(session.user);
    return session;
  }

  async function signUp(payload: SignUpPayload): Promise<UserResponse> {
    return AuthService.signUp(payload);
  }

  function signOut(): void {
    AuthService.signOut();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isInitializing,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
