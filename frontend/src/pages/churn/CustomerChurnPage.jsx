import React, { useState, useEffect } from 'react';
import {
  UserX,
  Search,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Gift,
  Mail,
  Phone,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { customerService } from '@/services/customerService';
import { formatCurrency, formatDate } from '@/utils/formatters';

export const CustomerChurnPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSimulatedPreview, setIsSimulatedPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      const data = await customerService.getCustomers();
      setCustomers(data);
      if (data.length > 0) {
        setSelectedCustomer(data[0]);
      }
    }
    loadCustomers();
  }, []);

  const handleRunChurnScan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSimulatedPreview(true);
    }, 600);
  };

  const highRiskCustomers = customers.filter((c) => c.churnRisk === 'High');
  const mediumRiskCustomers = customers.filter((c) => c.churnRisk === 'Medium');
  const lowRiskCustomers = customers.filter((c) => c.churnRisk === 'Low');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = selectedRiskCategory === 'All' || c.churnRisk === selectedRiskCategory;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return <Badge variant="danger">High Risk (80%+)</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium Risk (40-79%)</Badge>;
      default:
        return <Badge variant="success">Low Risk (&lt;40%)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Churn Intelligence"
        subtitle="Identify accounts displaying attrition signals, evaluate engagement decay, and trigger retention campaigns."
        breadcrumbs={['Intelligence', 'Customer Churn']}
      >
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="gap-1.5 py-1 px-3">
            <UserX className="h-3.5 w-3.5 text-purple-600" />
            Classification ML Ready
          </Badge>
        </div>
      </PageHeader>

      {/* Integration Notice & Architecture Callout */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs text-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-sm">Python Scikit-Learn / PyTorch Integration Target</span>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              This classification dashboard predicts customer attrition probabilities using recency, frequency, monetary value (RFM), and engagement intervals. Ready for future FastAPI classification inference endpoints.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant={isSimulatedPreview ? 'secondary' : 'primary'}
            onClick={() => setIsSimulatedPreview(!isSimulatedPreview)}
          >
            {isSimulatedPreview ? 'Show Empty State' : 'Simulate UI Payload'}
          </Button>
        </div>
      </div>

      {!isSimulatedPreview ? (
        /* Section 14 Mandatory Empty State */
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
              <UserX className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Customer churn prediction will be available after ML model integration.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Customer retention models (Random Forest / Logistic Regression / Neural Net) are being developed to identify dormant purchasing behaviors before customer drop-off.
            </p>
            <div className="pt-2">
              <Button size="sm" onClick={() => setIsSimulatedPreview(true)}>
                Preview Churn Risk Layout
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Full Churn Risk Layout */
        <div className="space-y-6">
          {/* Risk Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'High' ? 'All' : 'High')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRiskCategory === 'High'
                  ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  High Churn Risk
                </span>
                <ShieldAlert className="h-4 w-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{highRiskCustomers.length} accounts</div>
              <p className="text-[11px] text-slate-400 mt-1">&gt; 90 days inactivity; engagement decay</p>
            </div>

            <div
              onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'Medium' ? 'All' : 'Medium')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRiskCategory === 'Medium'
                  ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                  Medium Attrition Risk
                </span>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{mediumRiskCustomers.length} accounts</div>
              <p className="text-[11px] text-slate-400 mt-1">45-90 days elapsed since last purchase</p>
            </div>

            <div
              onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'Low' ? 'All' : 'Low')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRiskCategory === 'Low'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Low Churn Risk
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{lowRiskCustomers.length} accounts</div>
              <p className="text-[11px] text-slate-400 mt-1">Consistent repeat order patterns</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
            <Input
              placeholder="Search customers under risk analysis..."
              leadingIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table & Details Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Churn Table (2 cols) */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Customer Risk Roster</CardTitle>
                  <CardDescription>Accounts prioritized by projected churn probability</CardDescription>
                </div>
                {selectedRiskCategory !== 'All' && (
                  <Badge variant="outline" onClick={() => setSelectedRiskCategory('All')} className="cursor-pointer">
                    Filtering: {selectedRiskCategory} &times;
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Lifetime Value</th>
                        <th className="py-2.5 px-3">Last Order</th>
                        <th className="py-2.5 px-3 text-center">Risk Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map((cust) => (
                        <tr
                          key={cust.id}
                          onClick={() => setSelectedCustomer(cust)}
                          className={`cursor-pointer transition-colors ${
                            selectedCustomer?.id === cust.id
                              ? 'bg-indigo-50/70 font-medium'
                              : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900">{cust.name}</span>
                            <p className="text-[11px] text-slate-400">{cust.email}</p>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {formatCurrency(cust.totalSpending)}
                          </td>
                          <td className="py-3 px-3 text-slate-500">{formatDate(cust.lastOrderDate)}</td>
                          <td className="py-3 px-3 text-center">{getRiskBadge(cust.churnRisk)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details & Retention Panel (1 col) */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Account Diagnostic</CardTitle>
                  <CardDescription>Individual behavior metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {selectedCustomer ? (
                    <>
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <img
                          src={
                            selectedCustomer.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=6366f1&color=fff`
                          }
                          alt={selectedCustomer.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{selectedCustomer.name}</p>
                          <p className="text-[11px] text-slate-400">{selectedCustomer.email}</p>
                          <div className="mt-1">{getRiskBadge(selectedCustomer.churnRisk)}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-slate-600">
                        <div className="flex justify-between">
                          <span>Total Completed Orders:</span>
                          <span className="font-semibold text-slate-900">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cumulative Spending:</span>
                          <span className="font-bold text-slate-900">{formatCurrency(selectedCustomer.totalSpending)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Active Order:</span>
                          <span className="font-medium text-slate-900">{formatDate(selectedCustomer.lastOrderDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="text-slate-800">{selectedCustomer.city}</span>
                        </div>
                      </div>

                      {/* Retention Recommendation Section */}
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 space-y-2 mt-4">
                        <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                          <Gift className="h-4 w-4" />
                          <span>Retention Strategy Recommendation</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {selectedCustomer.churnRisk === 'High'
                            ? 'Dispatch a personalized 20% reactivation voucher with a curated reminder of previously purchased categories.'
                            : selectedCustomer.churnRisk === 'Medium'
                            ? 'Enroll account in exclusive loyalty VIP tier and send product replenishment notification.'
                            : 'Send seasonal new collection preview and loyalty point balance summary.'}
                        </p>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => alert(`Retention campaign email prepared for ${selectedCustomer.email}`)}
                        >
                          Trigger Automated Outreach
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400 py-6 text-center">Select a customer to inspect diagnostics.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
