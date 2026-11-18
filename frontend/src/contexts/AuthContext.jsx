import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial user
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authService.register(userData);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    const updated = authService.switchRole(role);
    setUser(updated);
  };

  const updateProfile = async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    role: user?.role || 'Guest',
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchRole,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
