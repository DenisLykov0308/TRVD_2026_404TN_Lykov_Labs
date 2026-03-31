import type { AuthSession, AuthenticatedUser } from '@/types/auth';

const ACCESS_TOKEN_STORAGE_KEY = 'warehouse.auth.access_token';
const AUTH_USER_STORAGE_KEY = 'warehouse.auth.user';
const TOKEN_TYPE_STORAGE_KEY = 'warehouse.auth.token_type';
const EXPIRES_IN_STORAGE_KEY = 'warehouse.auth.expires_in';

export const AUTH_SESSION_EXPIRED_EVENT = 'warehouse:auth-session-expired';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readStorage(key: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(key);
}

function writeStorage(key: string, value: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, value);
}

function removeStorage(key: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getAccessToken(): string | null {
  return readStorage(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  writeStorage(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function removeAccessToken(): void {
  removeStorage(ACCESS_TOKEN_STORAGE_KEY);
}

export function getStoredAuthUser(): AuthenticatedUser | null {
  const rawValue = readStorage(AUTH_USER_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthenticatedUser;
  } catch {
    removeStorage(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  setAccessToken(session.access_token);
  writeStorage(AUTH_USER_STORAGE_KEY, JSON.stringify(session.user));
  writeStorage(TOKEN_TYPE_STORAGE_KEY, session.token_type);
  writeStorage(EXPIRES_IN_STORAGE_KEY, String(session.expires_in));
}

export function clearAuthSession(): void {
  removeAccessToken();
  removeStorage(AUTH_USER_STORAGE_KEY);
  removeStorage(TOKEN_TYPE_STORAGE_KEY);
  removeStorage(EXPIRES_IN_STORAGE_KEY);
}

export function notifyUnauthorizedSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}
