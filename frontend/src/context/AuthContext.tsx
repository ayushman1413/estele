import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api, describeError } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('estele_token'));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState<boolean>(Boolean(localStorage.getItem('estele_token')));

  const refresh = useCallback(async () => {
    const stored = localStorage.getItem('estele_token');
    if (!stored) {
      setInitializing(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
    } catch {
      localStorage.removeItem('estele_token');
      setToken(null);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: u, token: t } = res.data.data;
      localStorage.setItem('estele_token', t);
      setToken(t);
      setUser(u);
    } catch (err) {
      throw describeError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, password_confirmation: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, password_confirmation });
      const { user: u, token: t } = res.data.data;
      localStorage.setItem('estele_token', t);
      setToken(t);
      setUser(u);
    } catch (err) {
      throw describeError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    localStorage.removeItem('estele_token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user, token, loading, initializing,
    login, register, logout, refresh,
  }), [user, token, loading, initializing, login, register, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
