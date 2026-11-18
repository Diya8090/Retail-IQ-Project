import {
  monthlyRevenueData,
  salesOverviewWeekly,
  topSellingProductsData,
  salesByCategoryData,
  recentActivitiesData,
} from '@/data/analytics';
import { initialOrders } from '@/data/orders';
import { initialProducts } from '@/data/products';
import { initialCustomers } from '@/data/customers';

export const analyticsService = {
  async getDashboardSummary() {
    await new Promise((r) => setTimeout(r, 150));
    return {
      totalRevenue: 738650,
      revenueChange: 14.8,
      totalOrders: 1845,
      ordersChange: 8.2,
      totalProducts: initialProducts.length,
      productsChange: 4.1,
      totalCustomers: 1240,
      customersChange: 12.3,
      lowStockCount: initialProducts.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length,
    };
  },

  async getMonthlyRevenue() {
    await new Promise((r) => setTimeout(r, 150));
    return monthlyRevenueData;
  },

  async getSalesOverview() {
    await new Promise((r) => setTimeout(r, 150));
    return salesOverviewWeekly;
  },

  async getTopSellingProducts() {
    await new Promise((r) => setTimeout(r, 150));
    return topSellingProductsData;
  },

  async getSalesByCategory() {
    await new Promise((r) => setTimeout(r, 150));
    return salesByCategoryData;
  },

  async getRecentActivities() {
    await new Promise((r) => setTimeout(r, 150));
    return recentActivitiesData;
  },
};
