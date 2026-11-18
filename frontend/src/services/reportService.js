import { initialProducts } from '@/data/products';
import { initialOrders } from '@/data/orders';
import { initialCustomers } from '@/data/customers';

export const reportService = {
  async getSalesReport(dateRange = 'last30') {
    await new Promise((r) => setTimeout(r, 200));
    return initialOrders.map((o) => ({
      orderId: o.id,
      date: o.date.split('T')[0],
      customer: o.customerName,
      itemsCount: o.items.length,
      subtotal: o.subtotal,
      tax: o.tax,
      shipping: o.shipping,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
    }));
  },

  async getInventoryReport() {
    await new Promise((r) => setTimeout(r, 200));
    return initialProducts.map((p) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      currentStock: p.currentStock,
      minimumStock: p.minimumStock,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      inventoryValuation: p.currentStock * p.costPrice,
      status: p.status,
      totalSold: p.totalSold,
    }));
  },

  async getCustomerReport() {
    await new Promise((r) => setTimeout(r, 200));
    return initialCustomers.map((c) => ({
      customerId: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      city: c.city,
      registeredDate: c.registrationDate,
      totalOrders: c.totalOrders,
      totalSpending: c.totalSpending,
      status: c.status,
      churnRisk: c.churnRisk,
      lastOrderDate: c.lastOrderDate,
    }));
  },
};
