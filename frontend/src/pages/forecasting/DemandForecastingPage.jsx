import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Store,
  Package,
  Calendar,
  Sparkles,
  Info,
  TrendingUp,
  BarChart2,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { productService } from '@/services/productService';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export const DemandForecastingPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState('store-01');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState('14');
  const [isSimulatedPreview, setIsSimulatedPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const prods = await productService.getProducts();
      setProducts(prods);
      if (prods.length > 0) {
        setSelectedProduct(prods[0].id);
      }
    }
    fetchProducts();
  }, []);

  const handleForecastClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSimulatedPreview(true);
    }, 600);
  };

  // Sample historical sales series (60 days)
  const historicalData = [
    { date: 'Day -14', actual: 42 },
    { date: 'Day -13', actual: 45 },
    { date: 'Day -12', actual: 38 },
    { date: 'Day -11', actual: 52 },
    { date: 'Day -10', actual: 48 },
    { date: 'Day -9', actual: 55 },
    { date: 'Day -8', actual: 61 },
    { date: 'Day -7', actual: 58 },
    { date: 'Day -6', actual: 64 },
    { date: 'Day -5', actual: 70 },
    { date: 'Day -4', actual: 66 },
    { date: 'Day -3', actual: 72 },
    { date: 'Day -2', actual: 75 },
    { date: 'Day -1', actual: 79 },
  ];

  // Simulated forecasted regression trajectory for preview inspection
  const forecastData = [
    { date: 'Day +1', predicted: 82, confidenceLow: 76, confidenceHigh: 88 },
    { date: 'Day +2', predicted: 85, confidenceLow: 78, confidenceHigh: 92 },
    { date: 'Day +3', predicted: 81, confidenceLow: 74, confidenceHigh: 89 },
    { date: 'Day +4', predicted: 89, confidenceLow: 80, confidenceHigh: 98 },
    { date: 'Day +5', predicted: 94, confidenceLow: 85, confidenceHigh: 104 },
    { date: 'Day +6', predicted: 102, confidenceLow: 91, confidenceHigh: 112 },
    { date: 'Day +7', predicted: 98, confidenceLow: 87, confidenceHigh: 108 },
    { date: 'Day +8', predicted: 88, confidenceLow: 77, confidenceHigh: 99 },
    { date: 'Day +9', predicted: 91, confidenceLow: 79, confidenceHigh: 102 },
    { date: 'Day +10', predicted: 96, confidenceLow: 84, confidenceHigh: 108 },
    { date: 'Day +11', predicted: 104, confidenceLow: 90, confidenceHigh: 117 },
    { date: 'Day +12', predicted: 110, confidenceLow: 95, confidenceHigh: 125 },
    { date: 'Day +13', predicted: 106, confidenceLow: 91, confidenceHigh: 121 },
    { date: 'Day +14', predicted: 115, confidenceLow: 98, confidenceHigh: 132 },
  ];

  const activeProduct = products.find((p) => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Demand Forecasting (Regression Model)"
        subtitle="Predict upcoming product sales velocity using multivariate regression models and seasonal sales patterns."
        breadcrumbs={['Intelligence', 'Demand Forecasting']}
      >
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="gap-1.5 py-1 px-3">
            <BrainCircuit className="h-3.5 w-3.5 text-purple-600" />
            FastAPI Regression Pipeline
          </Badge>
        </div>
      </PageHeader>

      {/* Integration Notice & Architecture Callout */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs text-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-sm">System Ready for Python FastAPI ML Service</span>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              This interface is engineered to connect directly with the upcoming FastAPI demand regression service via NestJS.
              Before the model is officially trained on historical POS datasets, the UI showcases the production schema, evaluation metrics, and prediction dashboard layout.
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

      {/* Parameter Selection Controls Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Forecast Model Parameters</CardTitle>
          <CardDescription>Select target store location, catalog SKU, and projection horizon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <Select
              label="Store Location"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              options={[
                { label: 'Store #01 – Flagship Manhattan', value: 'store-01' },
                { label: 'Store #02 – San Francisco Downtown', value: 'store-02' },
                { label: 'Store #03 – Austin Regional Hub', value: 'store-03' },
                { label: 'All Channels / Aggregate', value: 'store-all' },
              ]}
            />

            <Select
              label="Product SKU"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              options={products.map((p) => ({
                label: `${p.name} (${p.sku})`,
                value: p.id,
              }))}
            />

            <Select
              label="Forecasting Horizon"
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value)}
              options={[
                { label: 'Next 7 Days (Short Horizon)', value: '7' },
                { label: 'Next 14 Days (Bi-Weekly)', value: '14' },
                { label: 'Next 30 Days (Monthly Outlook)', value: '30' },
              ]}
            />

            <Button
              className="h-9 w-full"
              isLoading={loading}
              onClick={handleForecastClick}
              icon={BrainCircuit}
            >
              Run Demand Forecast
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isSimulatedPreview ? (
        /* Section 13 Mandatory Empty State */
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
              <BrainCircuit className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Demand forecasting will be available after ML model integration.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The regression pipeline (XGBoost / Prophet / Linear Regression) is being trained on historical store transactions. Once connected to the FastAPI endpoints, real-time demand projections will populate automatically.
            </p>
            <div className="pt-2">
              <Button size="sm" onClick={() => setIsSimulatedPreview(true)}>
                Preview Schema & UI Architecture
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Forecast Results & Metrics Layout */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                Forecasted Unit Demand
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">1,348 units</span>
                <span className="text-xs text-emerald-600 font-semibold">+18.2%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Projected over next {forecastPeriod} days</p>
            </Card>

            <Card className="p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Projected Gross Sales
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(1348 * (activeProduct?.sellingPrice || 45))}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Based on unit price of {formatCurrency(activeProduct?.sellingPrice || 45)}</p>
            </Card>

            <Card className="p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Current Inventory Buffer
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{activeProduct?.currentStock || 45} units</span>
                <Badge variant="danger" className="text-[10px]">Stockout Risk</Badge>
              </div>
              <p className="text-[11px] text-rose-500 font-medium mt-1">Deficit of ~1,300 units anticipated</p>
            </Card>

            <Card className="p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Recommended Restock PO
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-indigo-600">1,500 units</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Lead time allowance: 4 business days</p>
            </Card>
          </div>

          {/* Forecast & Historical Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Historical Trend Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm">Historical 14-Day Sales Velocity</CardTitle>
                  <CardDescription>Observed daily transactions before projection</CardDescription>
                </div>
                <Badge variant="secondary">Ground Truth Data</Badge>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Sales (Units)"
                        stroke="#64748b"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#64748b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Predicted Demand Trajectory Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm">Future Predicted Demand Curve</CardTitle>
                  <CardDescription>Model projection with 95% confidence intervals</CardDescription>
                </div>
                <Badge variant="purple">ML Model Output</Badge>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted Demand"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        fill="url(#ciGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Evaluation Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cpu className="h-4 w-4 text-indigo-600" />
                Regression Model Evaluation Benchmark
              </CardTitle>
              <CardDescription>Cross-validation accuracy scores from model training pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">RMSE (Root Mean Square)</span>
                  <p className="text-base font-bold text-slate-800 mt-1">4.21 units</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Test split deviation</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">MAE (Mean Absolute Error)</span>
                  <p className="text-base font-bold text-slate-800 mt-1">3.14 units</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Average unit variance</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">R² Coefficient</span>
                  <p className="text-base font-bold text-emerald-600 mt-1">0.932</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">High explanatory variance</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">MAPE (Percentage Error)</span>
                  <p className="text-base font-bold text-slate-800 mt-1">5.8%</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Commercial grade accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
