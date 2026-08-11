import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/auth.api';
import type { AuthUser, LoginPayload } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(storage.getUser());
  const [token, setToken] = useState<string | null>(storage.getToken());

  const login = async (payload: LoginPayload) => {
    const result = await authApi.login(payload);
    storage.setToken(result.token);
    storage.setUser(result.user);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    storage.clearSession();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

