import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'zedinfo@zed.org';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) return null;

    const normalizedEmail = userData.email?.toLowerCase?.() || '';
    return {
      ...userData,
      isAdmin: Boolean(userData.isAdmin) || normalizedEmail === ADMIN_EMAIL,
    };
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('tera_user');
    if (savedUser) {
      try {
        setUser(normalizeUser(JSON.parse(savedUser)));
      } catch (e) {
        localStorage.removeItem('tera_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem('tera_user', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tera_user');
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
