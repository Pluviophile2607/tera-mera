import React, { createContext, useContext, useState } from 'react';
import { apiUrl } from '../lib/api';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'zedinfo@zed.org';

export const AuthProvider = ({ children }) => {
  const normalizeUser = (userData) => {
    if (!userData) return null;

    const normalizedEmail = userData.email?.toLowerCase?.() || '';
    return {
      ...userData,
      isAdmin: Boolean(userData.isAdmin) || normalizedEmail === ADMIN_EMAIL,
    };
  };
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tera_user');
    if (!savedUser) return null;

    try {
      return normalizeUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('tera_user');
      return null;
    }
  });
  const [loading] = useState(false);

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem('tera_user', JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('tera_user');
    try {
      await fetch(apiUrl('/logout'), { method: 'POST' });
    } catch {
      // Ignore logout network failures because local client state is already cleared.
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: !!user?.isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
