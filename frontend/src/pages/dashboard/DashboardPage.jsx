import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { analyticsService } from '@/services/analyticsService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [salesOverview, setSalesOverview] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [
          summary,
          monthlyRev,
          salesWeekly,
          topSelling,
          categories,
          orders,
          products,
          acts,
        ] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getMonthlyRevenue(),
          analyticsService.getSalesOverview(),
          analyticsService.getTopSellingProducts(),
          analyticsService.getSalesByCategory(),
          orderService.getOrders(),
          productService.getProducts({ status: 'Low Stock' }),
          analyticsService.getRecentActivities(),
        ]);

        setMetrics(summary);
        setRevenueData(monthlyRev);
        setSalesOverview(salesWeekly);
        setTopProducts(topSelling);
        setCategoryData(categories);
        setRecentOrders(orders.slice(0, 5));
        setLowStockList(products.slice(0, 5));
        setActivities(acts);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating real-time retail intelligence..." className="h-96" />;
  }

  const handleExportSummary = () => {
    exportToCSV('retailiq-monthly-revenue', revenueData, [
      { key: 'month', label: 'Month' },
      { key: 'revenue', label: 'Revenue ($)', accessor: (r) => r.revenue },
      { key: 'target', label: 'Target ($)', accessor: (r) => r.target },
      { key: 'orders', label: 'Orders Count' },
    ]);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'Shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'Processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Executive Retail Dashboard"
        subtitle="Real-time multi-channel sales overview, stock velocity, and inventory alerts."
        breadcrumbs={['Home', 'Dashboard']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportSummary}>
            Export Summary
          </Button>
          <Button size="sm" icon={ShoppingCart} onClick={() => navigate('/orders/new')}>
            New Order
          </Button>
        </div>
      </PageHeader>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          change={metrics?.revenueChange}
          period="vs. last month"
          icon={DollarSign}
          iconColor="bg-indigo-50 text-indigo-600 border-indigo-100"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(metrics?.totalOrders || 0)}
          change={metrics?.ordersChange}
          period="vs. last month"
          icon={ShoppingCart}
          iconColor="bg-blue-50 text-blue-600 border-blue-100"
        />
        <StatCard
          title="Active Products"
          value={formatNumber(metrics?.totalProducts || 0)}
          change={metrics?.productsChange}
          period="catalog items"
          icon={Package}
          iconColor="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(metrics?.totalCustomers || 0)}
          change={metrics?.customersChange}
          period="registered buyers"
          icon={Users}
          iconColor="bg-purple-50 text-purple-600 border-purple-100"
        />
        <StatCard
          title="Stock Alerts"
          value={metrics?.lowStockCount || 0}
          change="-2"
          changeType="negative"
          period="need restock"
          icon={AlertTriangle}
          iconColor="bg-amber-50 text-amber-600 border-amber-100"
        />
      </div>

      {/* Primary Analytics Charts Row (2 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Revenue Area Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Revenue Performance</CardTitle>
              <CardDescription>Actual revenue vs. baseline targets over the past 12 months</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Target
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Amount']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                    name="Actual Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="transparent"
                    name="Target Goal"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Sales by Category Donut Chart (1 col) */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Product category contribution to total sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-600">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                  <span className="font-semibold ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Analytics Charts Row (2 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Weekly Sales Overview Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Sales Velocity</CardTitle>
              <CardDescription>Daily comparison of Online vs In-Store revenue</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Online
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> In-Store
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesOverview} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Sales']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="onlineSales" name="Online" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inStoreSales" name="In-Store" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Top Selling Products Horizontal Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Units sold across product lines</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-xs">
              View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tick={{ fontSize: 11, fill: '#334155' }}
                  />
                  <Tooltip
                    formatter={(val) => [`${val} units`, 'Units Sold']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Sections: Recent Orders & Low Stock & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer transactions requiring fulfillment</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              All Orders <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-indigo-600">{order.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">{order.customerName}</td>
                      <td className="py-3 px-3 text-slate-500">{formatDate(order.date)}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-3 text-right">{getOrderStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Watchlist (1 col) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Items near or below replenishment threshold</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>
              Restock
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockList.length > 0 ? (
              lowStockList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      SKU: <span className="font-mono">{item.sku}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-rose-600">{item.currentStock} left</span>
                    <p className="text-[10px] text-slate-400">Min: {item.minimumStock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">All inventory items are well-stocked.</p>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate('/inventory')}
            >
              Open Inventory Console
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log / Recent Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            <CardTitle>System Activity Audit Log</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Live operational events</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 bg-white shadow-2xs hover:border-slate-200 transition-colors text-xs"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{act.user}</span>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{act.action}</p>
                  <p className="text-[11px] font-mono text-indigo-600 truncate mt-0.5">{act.target}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
