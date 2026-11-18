import { initialUsers } from '@/data/users';

let usersState = [...initialUsers];

export const userService = {
  async getUsers(search = '') {
    await new Promise((r) => setTimeout(r, 150));
    if (!search) return usersState;
    const q = search.toLowerCase();
    return usersState.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  },

  async createUser(userData) {
    await new Promise((r) => setTimeout(r, 250));
    const newUser = {
      ...userData,
      id: 'usr-' + Date.now(),
      status: 'Active',
      lastActive: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };
    usersState = [newUser, ...usersState];
    return newUser;
  },

  async updateUser(id, updates) {
    await new Promise((r) => setTimeout(r, 200));
    usersState = usersState.map((u) => (u.id === id ? { ...u, ...updates } : u));
    return usersState.find((u) => u.id === id);
  },

  async toggleUserStatus(id) {
    await new Promise((r) => setTimeout(r, 200));
    usersState = usersState.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    );
    return usersState.find((u) => u.id === id);
  },
};
