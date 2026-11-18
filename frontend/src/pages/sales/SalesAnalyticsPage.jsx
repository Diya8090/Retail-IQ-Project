import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Calendar,
  Download,
  ArrowUpRight,
  Sparkles,
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
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { analyticsService } from '@/services/analyticsService';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const SalesAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [revenueData, setRevenueData] = useState([]);
  const [salesWeekly, setSalesWeekly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [monthly, weekly, top, cat] = await Promise.all([
          analyticsService.getMonthlyRevenue(),
          analyticsService.getSalesOverview(),
          analyticsService.getTopSellingProducts(),
          analyticsService.getSalesByCategory(),
        ]);
        setRevenueData(monthly);
        setSalesWeekly(weekly);
        setTopProducts(top);
        setCategoryData(cat);
      } catch (err) {
        console.error('Error loading sales analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [dateRange]);

  const totalRevenue = revenueData.reduce((acc, m) => acc + m.revenue, 0);
  const totalOrders = revenueData.reduce((acc, m) => acc + m.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const growthRate = 18.4;

  const handleExport = () => {
    exportToCSV('retailiq-sales-analytics', revenueData, [
      { key: 'month', label: 'Month' },
      { key: 'revenue', label: 'Revenue ($)', accessor: (r) => r.revenue },
      { key: 'target', label: 'Target ($)', accessor: (r) => r.target },
      { key: 'orders', label: 'Total Orders' },
      {
        key: 'aov',
        label: 'AOV ($)',
        accessor: (r) => (r.revenue / r.orders).toFixed(2),
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner text="Computing multi-channel sales metrics..." className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales & Revenue Analytics"
        subtitle="Deep dive into transaction volume, revenue velocity, basket sizes, and category conversion."
        breadcrumbs={['Management', 'Sales Analytics']}
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
              { label: 'Year to Date', value: 'ytd' },
            ]}
          />
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
            Export
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(totalRevenue)}
          change={14.8}
          period="selected timeline"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <StatCard
          title="Average Order Value (AOV)"
          value={formatCurrency(avgOrderValue)}
          change={6.2}
          period="per transaction"
          icon={CreditCard}
          iconColor="bg-indigo-50 text-indigo-600 border-indigo-100"
        />
        <StatCard
          title="Total Orders Processed"
          value={formatNumber(totalOrders)}
          change={9.5}
          period="completed fulfillments"
          icon={ShoppingCart}
          iconColor="bg-blue-50 text-blue-600 border-blue-100"
        />
        <StatCard
          title="Revenue Growth Rate"
          value={`+${growthRate}%`}
          change={3.1}
          period="YoY performance"
          icon={TrendingUp}
          iconColor="bg-purple-50 text-purple-600 border-purple-100"
        />
      </div>

      {/* Main Revenue Trajectory Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Trajectory & Target Alignment</CardTitle>
            <CardDescription>Monthly fiscal comparisons against quota milestones</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Planned Target
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
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
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                  name="Gross Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Columns: Category Share & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Share by Category</CardTitle>
            <CardDescription>Product category contribution to total sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Contribution']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate text-slate-700">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 ml-2">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing SKUs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Generating Products</CardTitle>
            <CardDescription>Ranked by gross sales volume and unit velocity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3 text-center">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-900 truncate max-w-xs">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{p.sales}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        {formatCurrency(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
