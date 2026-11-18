import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Dashboard & Core Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProductListPage } from '@/pages/products/ProductListPage';
import { CategoryListPage } from '@/pages/categories/CategoryListPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { CustomerListPage } from '@/pages/customers/CustomerListPage';
import { OrderListPage } from '@/pages/orders/OrderListPage';
import { CreateOrderPage } from '@/pages/orders/CreateOrderPage';
import { SalesAnalyticsPage } from '@/pages/sales/SalesAnalyticsPage';
import { DemandForecastingPage } from '@/pages/forecasting/DemandForecastingPage';
import { CustomerChurnPage } from '@/pages/churn/CustomerChurnPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { UserManagementPage } from '@/pages/users/UserManagementPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { NotFoundPage } from '@/pages/common/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Application Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<SalesAnalyticsPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/new" element={<CreateOrderPage />} />
            <Route path="/sales" element={<SalesAnalyticsPage />} />
            <Route path="/forecasting" element={<DemandForecastingPage />} />
            <Route path="/churn" element={<CustomerChurnPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
