/**
 * Mock Authentication Service
 * NOTE: This is a frontend simulation for prototype & UI testing.
 * Ready to be replaced by NestJS JWT /auth/login & /auth/register endpoints.
 */

const STORAGE_KEY = 'retailiq_auth_user';
const TOKEN_KEY = 'retailiq_token';

const defaultAdminUser = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'admin@retailiq.io',
  role: 'Admin', // 'Admin' | 'Store Manager' | 'Sales Analyst'
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  title: 'Lead Operations Director',
};

export const authService = {
  async login({ email, password, role = 'Admin' }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple validation mock
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const user = {
      ...defaultAdminUser,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo User',
      role: email.includes('manager') ? 'Store Manager' : email.includes('analyst') ? 'Sales Analyst' : role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-' + Date.now());
    return { user, token: 'mock-jwt-token' };
  },

  async register({ name, email, password }) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'Store Manager', // Default registered role
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: 'Store Operations Associate',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-' + Date.now());
    return { user, token: 'mock-jwt-token' };
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return defaultAdminUser;
  },

  async updateProfile(updates) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return true;
  },

  switchRole(newRole) {
    const current = this.getCurrentUser();
    const updated = { ...current, role: newRole };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
