import { initialOrders } from '@/data/orders';

let ordersState = [...initialOrders];

export const orderService = {
  async getOrders({ search = '', status = '' } = {}) {
    await new Promise((r) => setTimeout(r, 200));
    let filtered = [...ordersState];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((o) => o.status === status);
    }

    return filtered;
  },

  async getOrderById(id) {
    await new Promise((r) => setTimeout(r, 150));
    return ordersState.find((o) => o.id === id) || null;
  },

  async createOrder(orderPayload) {
    await new Promise((r) => setTimeout(r, 350));
    const newOrder = {
      ...orderPayload,
      id: `ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'Pending',
      paymentStatus: 'Paid',
    };
    ordersState = [newOrder, ...ordersState];
    return newOrder;
  },

  async updateOrderStatus(id, newStatus) {
    await new Promise((r) => setTimeout(r, 250));
    ordersState = ordersState.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
    return ordersState.find((o) => o.id === id);
  },

  async cancelOrder(id) {
    await new Promise((r) => setTimeout(r, 200));
    return this.updateOrderStatus(id, 'Cancelled');
  },
};
