import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, apiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role?: 'buyer' | 'seller') => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
    businessName?: string;
    businessAddress?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      apiClient.setToken(storedToken);
      setToken(storedToken);
      // Fetch user data
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Token might be invalid, clear it
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role?: 'buyer' | 'seller') => {
    try {
      const response = await authAPI.login({ email, password, role });
      apiClient.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
    businessName?: string;
    businessAddress?: string;
  }) => {
    try {
      const response = await authAPI.register(data);
      apiClient.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    apiClient.setToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

