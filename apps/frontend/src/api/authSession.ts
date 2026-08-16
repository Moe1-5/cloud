import type { UserAccountRecord } from "@ddac/shared";

const sessionKey = "ddac.authSession";

export interface StoredAuthSession {
  token: string;
  user: UserAccountRecord;
  expiresAt: string;
}

export function getStoredAuthSession(): StoredAuthSession | null {
  const rawSession = window.localStorage.getItem(sessionKey);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as StoredAuthSession;

    if (!session.token || Date.parse(session.expiresAt) <= Date.now()) {
      clearStoredAuthSession();
      return null;
    }

    return session;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function setStoredAuthSession(session: StoredAuthSession): void {
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearStoredAuthSession(): void {
  window.localStorage.removeItem(sessionKey);
}

export function getAuthHeaders(): Record<string, string> {
  const session = getStoredAuthSession();

  return session
    ? {
        Authorization: `Bearer ${session.token}`
      }
    : {};
}
