import { initialCustomers } from '@/data/customers';

let customersState = [...initialCustomers];

export const customerService = {
  async getCustomers({ search = '', risk = '', status = '' } = {}) {
    await new Promise((r) => setTimeout(r, 200));
    let filtered = [...customersState];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }

    if (risk && risk !== 'All') {
      filtered = filtered.filter((c) => c.churnRisk === risk);
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((c) => c.status === status);
    }

    return filtered;
  },

  async getCustomerById(id) {
    await new Promise((r) => setTimeout(r, 150));
    return customersState.find((c) => c.id === id) || null;
  },

  async createCustomer(customerData) {
    await new Promise((r) => setTimeout(r, 300));
    const newCustomer = {
      ...customerData,
      id: 'cust-' + Date.now(),
      totalOrders: 0,
      totalSpending: 0,
      status: 'Active',
      churnRisk: 'Low',
      registrationDate: new Date().toISOString().split('T')[0],
      lastOrderDate: 'Never',
    };
    customersState = [newCustomer, ...customersState];
    return newCustomer;
  },

  async updateCustomer(id, updates) {
    await new Promise((r) => setTimeout(r, 250));
    customersState = customersState.map((c) => (c.id === id ? { ...c, ...updates } : c));
    return customersState.find((c) => c.id === id);
  },

  async deleteCustomer(id) {
    await new Promise((r) => setTimeout(r, 200));
    customersState = customersState.filter((c) => c.id !== id);
    return true;
  },
};
