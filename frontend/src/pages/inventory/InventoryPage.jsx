import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Boxes,
  AlertTriangle,
  PackageX,
  DollarSign,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  History,
  ArrowDownRight,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { DataTable } from '@/components/tables/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { productService } from '@/services/productService';
import { inventoryService } from '@/services/inventoryService';
import { stockAdjustmentSchema } from '@/validations';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const InventoryPage = () => {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'history'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [movementTypeFilter, setMovementTypeFilter] = useState('All');

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [defaultOperation, setDefaultOperation] = useState('STOCK_IN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: '',
      type: 'STOCK_IN',
      quantity: 10,
      reason: '',
    },
  });

  const selectedProductId = watch('productId');
  const selectedType = watch('type');
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [sum, prods, movs] = await Promise.all([
        inventoryService.getInventorySummary(),
        productService.getProducts({ search, status: statusFilter }),
        inventoryService.getMovements(search, movementTypeFilter),
      ]);
      setSummary(sum);
      setProducts(prods);
      setMovements(movs);
    } catch (err) {
      console.error('Error loading inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [search, statusFilter, movementTypeFilter]);

  const openAdjustmentModal = (type = 'STOCK_IN', product = null) => {
    setDefaultOperation(type);
    setValue('type', type);
    if (product) {
      setValue('productId', product.id);
    }
    setIsAdjustModalOpen(true);
  };

  const onAdjustSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await inventoryService.recordStockMovement({
        productId: data.productId,
        type: data.type,
        quantity: Number(data.quantity),
        reason: data.reason,
      });
      reset();
      setIsAdjustModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportInventory = () => {
    exportToCSV('retailiq-inventory-snapshot', products, [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Product' },
      { key: 'category', label: 'Category' },
      { key: 'currentStock', label: 'Units On Hand' },
      { key: 'minimumStock', label: 'Safety Threshold' },
      { key: 'costPrice', label: 'Cost Basis ($)' },
      { key: 'status', label: 'Stock Status' },
      {
        key: 'valuation',
        label: 'Total Value ($)',
        accessor: (r) => (r.currentStock * r.costPrice).toFixed(2),
      },
    ]);
  };

  const inventoryColumns = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-800">{row.sku}</span>,
    },
    {
      key: 'name',
      label: 'Product Description',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 leading-tight">{row.name}</span>
          <p className="text-[11px] text-slate-400">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span
          className={`font-bold ${
            row.currentStock === 0
              ? 'text-rose-600'
              : row.currentStock <= row.minimumStock
              ? 'text-amber-600'
              : 'text-slate-800'
          }`}
        >
          {row.currentStock} units
        </span>
      ),
    },
    {
      key: 'minimumStock',
      label: 'Safety Threshold',
      sortable: true,
      align: 'center',
      render: (row) => <span className="text-slate-500 font-medium">{row.minimumStock} units</span>,
    },
    {
      key: 'costPrice',
      label: 'Unit Cost',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-slate-600">{formatCurrency(row.costPrice)}</span>,
    },
    {
      key: 'valuation',
      label: 'Total Valuation',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-slate-900">
          {formatCurrency(row.currentStock * row.costPrice)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Badge
          variant={
            row.status === 'In Stock' ? 'success' : row.status === 'Low Stock' ? 'warning' : 'danger'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Adjust Stock',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => openAdjustmentModal('STOCK_IN', row)}
          >
            + In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => openAdjustmentModal('STOCK_OUT', row)}
          >
            - Out
          </Button>
        </div>
      ),
    },
  ];

  const movementColumns = [
    {
      key: 'timestamp',
      label: 'Date & Time',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {formatDate(row.timestamp, { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Operation',
      render: (row) => {
        if (row.type === 'STOCK_IN') {
          return (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
              <ArrowUpRight className="h-3 w-3" /> Stock In
            </span>
          );
        }
        if (row.type === 'STOCK_OUT') {
          return (
            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 text-xs px-2 py-0.5 rounded-full font-medium">
              <ArrowDownRight className="h-3 w-3" /> Stock Out
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <RotateCcw className="h-3 w-3" /> Adjustment
          </span>
        );
      },
    },
    {
      key: 'productName',
      label: 'Product / SKU',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900">{row.productName}</span>
          <p className="text-[11px] font-mono text-slate-400">SKU: {row.sku}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity Change',
      align: 'center',
      render: (row) => (
        <span
          className={`font-bold font-mono ${
            row.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
        </span>
      ),
    },
    {
      key: 'newStock',
      label: 'Resulting Stock',
      align: 'center',
      render: (row) => (
        <span className="text-slate-700 text-xs font-semibold">
          {row.previousStock} → {row.newStock}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason / Document #',
      render: (row) => <span className="text-slate-600 text-xs">{row.reason}</span>,
    },
    {
      key: 'performedBy',
      label: 'Authorized By',
      render: (row) => <span className="text-slate-500 text-xs">{row.performedBy}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Operations & Stock Control"
        subtitle="Track stock level thresholds, execute adjustments, and audit inventory transactions."
        breadcrumbs={['Management', 'Inventory']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportInventory}>
            Export Snapshot
          </Button>
          <Button size="sm" icon={Plus} onClick={() => openAdjustmentModal('STOCK_IN')}>
            Adjust Stock
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock Units"
          value={formatNumber(summary?.totalUnits || 0)}
          period="across active catalog"
          icon={Boxes}
          iconColor="bg-blue-50 text-blue-600 border-blue-100"
        />
        <StatCard
          title="Low Stock Warning"
          value={summary?.lowStockCount || 0}
          changeType="warning"
          period="items below min threshold"
          icon={AlertTriangle}
          iconColor="bg-amber-50 text-amber-600 border-amber-100"
        />
        <StatCard
          title="Out of Stock Items"
          value={summary?.outOfStockCount || 0}
          changeType="negative"
          period="depleted inventory"
          icon={PackageX}
          iconColor="bg-rose-50 text-rose-600 border-rose-100"
        />
        <StatCard
          title="Inventory Cost Basis"
          value={formatCurrency(summary?.totalValuation || 0)}
          period="total asset valuation"
          icon={DollarSign}
          iconColor="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
      </div>

      {/* View Toggle Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Stock Directory
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          Stock Movement Log ({movements.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 w-full">
          <Input
            placeholder={
              activeTab === 'inventory'
                ? 'Search inventory by product, SKU or category...'
                : 'Search audit log by product, reason or operator...'
            }
            leadingIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {activeTab === 'inventory' ? (
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Stock Statuses', value: 'All' },
                { label: 'In Stock', value: 'In Stock' },
                { label: 'Low Stock', value: 'Low Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
              ]}
            />
          </div>
        ) : (
          <div className="w-full sm:w-48">
            <Select
              value={movementTypeFilter}
              onChange={(e) => setMovementTypeFilter(e.target.value)}
              options={[
                { label: 'All Movement Types', value: 'All' },
                { label: 'Stock In', value: 'STOCK_IN' },
                { label: 'Stock Out', value: 'STOCK_OUT' },
                { label: 'Adjustment', value: 'ADJUSTMENT' },
              ]}
            />
          </div>
        )}
      </div>

      {/* Table Section */}
      {loading ? (
        <LoadingSpinner text="Refreshing inventory records..." className="h-64" />
      ) : activeTab === 'inventory' ? (
        <DataTable
          columns={inventoryColumns}
          data={products}
          pageSize={10}
          emptyTitle="No stock records found"
          emptyDescription="Try clearing your search filters."
        />
      ) : (
        <DataTable
          columns={movementColumns}
          data={movements}
          pageSize={10}
          emptyTitle="No stock movements recorded"
          emptyDescription="Perform a Stock In or Stock Out adjustment to generate transaction logs."
        />
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Inventory Stock"
        description="Record a replenishment shipment, outbound dispatch, or audit reconciliation."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onAdjustSubmit)} className="space-y-4">
          <Select
            label="Product"
            error={errors.productId?.message}
            options={products.map((p) => ({
              label: `${p.name} (SKU: ${p.sku}) – Current: ${p.currentStock} units`,
              value: p.id,
            }))}
            {...register('productId')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Operation Type"
              options={[
                { label: 'Stock In (Replenish / Receive)', value: 'STOCK_IN' },
                { label: 'Stock Out (Dispatch / Damage)', value: 'STOCK_OUT' },
                { label: 'Inventory Correction', value: 'ADJUSTMENT' },
              ]}
              {...register('type')}
            />
            <Input
              label="Quantity"
              type="number"
              placeholder="e.g. 25"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-3 text-xs text-indigo-900">
              <span className="font-semibold">{selectedProduct.name}</span> currently has{' '}
              <span className="font-bold">{selectedProduct.currentStock} units</span> on hand.
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Reason / Reference Document <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. PO-9984 Supplier Delivery or Warehouse Audit"
              error={errors.reason?.message}
              {...register('reason')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Execute Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
