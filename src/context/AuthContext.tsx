import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthApiError,
  AuthSession,
  AuthUser,
  currentUserRequest,
  signInRequest,
  signUpRequest,
} from '../lib/authApi';
import { readAuthSession, removeAuthSession, writeAuthSession } from '../lib/authStorage';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  sessionError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseSession(value: string): AuthSession | null {
  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('token' in parsed) ||
    typeof parsed.token !== 'string' ||
    !('user' in parsed) ||
    typeof parsed.user !== 'object' ||
    parsed.user === null
  ) {
    return null;
  }
  const user = parsed.user as Record<string, unknown>;
  if (
    typeof user.id !== 'string' ||
    typeof user.name !== 'string' ||
    typeof user.email !== 'string' ||
    typeof user.createdAt !== 'string'
  ) {
    return null;
  }
  return { token: parsed.token, user: user as AuthUser };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const storedValue = await readAuthSession();
        if (!storedValue) return;

        const storedSession = parseSession(storedValue);
        if (!storedSession) {
          await removeAuthSession();
          return;
        }
        if (active) setSession(storedSession);

        try {
          const { user } = await currentUserRequest(storedSession.token);
          const refreshedSession = { ...storedSession, user };
          await writeAuthSession(JSON.stringify(refreshedSession));
          if (active) setSession(refreshedSession);
        } catch (error) {
          if (error instanceof AuthApiError && error.status === 401) {
            await removeAuthSession();
            if (active) setSession(null);
          } else if (active) {
            setSessionError('Could not verify your session with the server. Check your connection and try again.');
          }
        }
      } catch {
        if (active) setSessionError('Could not read your saved sign-in. Please sign in again.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const nextSession = await signInRequest(email, password);
    await writeAuthSession(JSON.stringify(nextSession));
    setSession(nextSession);
    setSessionError('');
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const nextSession = await signUpRequest(name, email, password);
    await writeAuthSession(JSON.stringify(nextSession));
    setSession(nextSession);
    setSessionError('');
  }, []);

  const signOut = useCallback(async () => {
    await removeAuthSession();
    setSession(null);
    setSessionError('');
  }, []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, isLoading, sessionError, signIn, signUp, signOut }),
    [session, isLoading, sessionError, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
