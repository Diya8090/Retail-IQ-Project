import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { DataTable } from '@/components/tables/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { reportService } from '@/services/reportService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const ReportsPage = () => {
  const [activeReportTab, setActiveReportTab] = useState('sales'); // 'sales' | 'inventory' | 'customer'
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);

  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const [sales, inv, cust] = await Promise.all([
          reportService.getSalesReport(dateRange),
          reportService.getInventoryReport(),
          reportService.getCustomerReport(),
        ]);
        setSalesData(sales);
        setInventoryData(inv);
        setCustomerData(cust);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [dateRange]);

  const handleExportCurrentReport = () => {
    if (activeReportTab === 'sales') {
      exportToCSV('retailiq-sales-report', salesData, [
        { key: 'orderId', label: 'Order ID' },
        { key: 'date', label: 'Date' },
        { key: 'customer', label: 'Customer' },
        { key: 'itemsCount', label: 'Lines' },
        { key: 'subtotal', label: 'Subtotal ($)' },
        { key: 'tax', label: 'Tax ($)' },
        { key: 'shipping', label: 'Shipping ($)' },
        { key: 'total', label: 'Total ($)' },
        { key: 'status', label: 'Status' },
        { key: 'paymentMethod', label: 'Payment' },
      ]);
    } else if (activeReportTab === 'inventory') {
      exportToCSV('retailiq-inventory-report', inventoryData, [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Product Name' },
        { key: 'category', label: 'Category' },
        { key: 'currentStock', label: 'Current Units' },
        { key: 'minimumStock', label: 'Min Threshold' },
        { key: 'costPrice', label: 'Cost Price ($)' },
        { key: 'sellingPrice', label: 'Selling Price ($)' },
        { key: 'inventoryValuation', label: 'Total Valuation ($)' },
        { key: 'status', label: 'Status' },
        { key: 'totalSold', label: 'Units Sold' },
      ]);
    } else {
      exportToCSV('retailiq-customer-report', customerData, [
        { key: 'customerId', label: 'Customer ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'registeredDate', label: 'Registration Date' },
        { key: 'totalOrders', label: 'Total Orders' },
        { key: 'totalSpending', label: 'Total Spending ($)' },
        { key: 'status', label: 'Status' },
        { key: 'churnRisk', label: 'Churn Risk Tier' },
      ]);
    }
  };

  const salesColumns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (r) => <span className="font-mono text-indigo-600 font-semibold">{r.orderId}</span> },
    { key: 'date', label: 'Date', sortable: true, render: (r) => <span className="text-slate-600">{formatDate(r.date)}</span> },
    { key: 'customer', label: 'Customer Name', sortable: true, render: (r) => <span className="font-semibold text-slate-900">{r.customer}</span> },
    { key: 'subtotal', label: 'Subtotal', align: 'right', render: (r) => formatCurrency(r.subtotal) },
    { key: 'tax', label: 'Tax', align: 'right', render: (r) => formatCurrency(r.tax) },
    { key: 'shipping', label: 'Shipping', align: 'right', render: (r) => formatCurrency(r.shipping) },
    { key: 'total', label: 'Total Revenue', align: 'right', sortable: true, render: (r) => <span className="font-bold text-slate-900">{formatCurrency(r.total)}</span> },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (r) => (
        <Badge variant={r.status === 'Delivered' ? 'success' : r.status === 'Cancelled' ? 'danger' : 'secondary'}>
          {r.status}
        </Badge>
      ),
    },
  ];

  const inventoryColumns = [
    { key: 'sku', label: 'SKU', sortable: true, render: (r) => <span className="font-mono font-semibold">{r.sku}</span> },
    { key: 'name', label: 'Product Name', sortable: true, render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'currentStock', label: 'On Hand', align: 'center', sortable: true, render: (r) => `${r.currentStock} units` },
    { key: 'costPrice', label: 'Unit Cost', align: 'right', render: (r) => formatCurrency(r.costPrice) },
    { key: 'inventoryValuation', label: 'Valuation', align: 'right', sortable: true, render: (r) => <span className="font-bold">{formatCurrency(r.inventoryValuation)}</span> },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (r) => (
        <Badge variant={r.status === 'In Stock' ? 'success' : r.status === 'Low Stock' ? 'warning' : 'danger'}>
          {r.status}
        </Badge>
      ),
    },
  ];

  const customerColumns = [
    { key: 'name', label: 'Customer', sortable: true, render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: 'email', label: 'Email', render: (r) => <span className="text-slate-500">{r.email}</span> },
    { key: 'city', label: 'City', render: (r) => r.city },
    { key: 'totalOrders', label: 'Completed Orders', align: 'center', sortable: true },
    { key: 'totalSpending', label: 'Lifetime Spend', align: 'right', sortable: true, render: (r) => <span className="font-bold">{formatCurrency(r.totalSpending)}</span> },
    {
      key: 'churnRisk',
      label: 'Churn Risk',
      align: 'center',
      render: (r) => (
        <Badge variant={r.churnRisk === 'Low' ? 'success' : r.churnRisk === 'Medium' ? 'warning' : 'danger'}>
          {r.churnRisk}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Reports & Audits"
        subtitle="Generate fiscal summaries, inventory valuation statements, and customer lifetime value exports."
        breadcrumbs={['Other', 'Reports']}
      >
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-36 h-9 text-xs"
            options={[
              { label: 'Last 7 Days', value: '7days' },
              { label: 'Last 30 Days', value: '30days' },
              { label: 'Last 90 Days', value: '90days' },
              { label: 'Annual FY2025', value: 'annual' },
            ]}
          />
          <Button size="sm" icon={Download} onClick={handleExportCurrentReport}>
            Export to CSV
          </Button>
        </div>
      </PageHeader>

      {/* Report Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveReportTab('sales')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'sales'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Sales & Revenue Report
        </button>
        <button
          onClick={() => setActiveReportTab('inventory')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-3.5 w-3.5" />
          Inventory Valuation Report
        </button>
        <button
          onClick={() => setActiveReportTab('customer')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeReportTab === 'customer'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Customer Lifetime Value Report
        </button>
      </div>

      {/* Report Table */}
      {loading ? (
        <LoadingSpinner text="Compiling financial report data..." className="h-64" />
      ) : activeReportTab === 'sales' ? (
        <DataTable columns={salesColumns} data={salesData} pageSize={10} />
      ) : activeReportTab === 'inventory' ? (
        <DataTable columns={inventoryColumns} data={inventoryData} pageSize={10} />
      ) : (
        <DataTable columns={customerColumns} data={customerData} pageSize={10} />
      )}
    </div>
  );
};
