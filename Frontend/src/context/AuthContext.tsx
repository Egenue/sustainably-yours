import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import type { ReactNode } from "react";

type User = Record<string, any> | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (payload: Record<string, any>) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete apiClient.defaults.headers.common.Authorization;
  }, [token]);

  const persist = (t: string | null, u: User) => {
    setToken(t); setUser(u);
    if (t) localStorage.setItem("token", t); else localStorage.removeItem("token");
    if (u) localStorage.setItem("user", JSON.stringify(u)); else localStorage.removeItem("user");
  };

  const login = async (email: string, password: string, role = "buyer") => {
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password, role });
      const data = res.data || {};
      const t = data.token || data.accessToken || null;
      const u = data.user || data.data || null;
      if (!t) throw new Error("No token returned");
      persist(t, u);
    } finally { setLoading(false); }
  };

  const register = async (payload: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", payload);
      const data = res.data || {};
      const t = data.token || data.accessToken || null;
      const u = data.user || data.data || null;
      if (t) persist(t, u);
    } finally { setLoading(false); }
  };

  const logout = () => persist(null, null);
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};