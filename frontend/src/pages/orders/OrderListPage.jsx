import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Download,
  DollarSign,
  User,
  Package,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Drawer } from '@/components/common/Drawer';
import { DataTable } from '@/components/tables/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Delivered');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders({
        search,
        status: statusFilter,
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setIsSubmitting(true);
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      setIsStatusModalOpen(false);
      await loadOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (order) => {
    if (window.confirm(`Are you sure you want to cancel order ${order.id}?`)) {
      try {
        await orderService.cancelOrder(order.id);
        await loadOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExport = () => {
    exportToCSV('retailiq-orders', orders, [
      { key: 'id', label: 'Order ID' },
      { key: 'customerName', label: 'Customer' },
      { key: 'customerEmail', label: 'Email' },
      { key: 'date', label: 'Order Date' },
      { key: 'status', label: 'Status' },
      { key: 'paymentMethod', label: 'Payment' },
      { key: 'subtotal', label: 'Subtotal ($)' },
      { key: 'tax', label: 'Tax ($)' },
      { key: 'shipping', label: 'Shipping ($)' },
      { key: 'total', label: 'Total Amount ($)' },
    ]);
  };

  const getStatusBadge = (status) => {
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

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-indigo-600">{row.id}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900">{row.customerName}</span>
          <p className="text-[11px] text-slate-400">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Order Date',
      sortable: true,
      render: (row) => <span className="text-slate-500 text-xs">{formatDate(row.date)}</span>,
    },
    {
      key: 'items',
      label: 'Items',
      align: 'center',
      render: (row) => (
        <span className="text-slate-700 text-xs font-medium">
          {row.items?.reduce((sum, item) => sum + item.quantity, 0) || 1} units ({row.items?.length || 1} lines)
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total Amount',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-slate-900 text-xs">{formatCurrency(row.total)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedOrder(row);
              setIsDetailsOpen(true);
            }}
            title="View order details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setSelectedOrder(row);
              setNewStatus(row.status);
              setIsStatusModalOpen(true);
            }}
          >
            Status
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        subtitle="Process customer transactions, manage shipment fulfillment stages, and review order totals."
        breadcrumbs={['Management', 'Orders']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
            Export Orders
          </Button>
          <Button size="sm" icon={Plus} onClick={() => navigate('/orders/new')}>
            Create New Order
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by Order ID (ORD-2025-XXXX), customer name, or email..."
            leadingIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Order Statuses', value: 'All' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Processing', value: 'Processing' },
            { label: 'Shipped', value: 'Shipped' },
            { label: 'Delivered', value: 'Delivered' },
            { label: 'Cancelled', value: 'Cancelled' },
          ]}
        />
      </div>

      {/* Orders DataTable */}
      {loading ? (
        <LoadingSpinner text="Fetching order records..." className="h-64" />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          pageSize={10}
          emptyTitle="No orders found"
          emptyDescription="Create your first customer order using the Create New Order button above."
          emptyAction={{
            label: 'Create Order',
            onClick: () => navigate('/orders/new'),
          }}
        />
      )}

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Order Status"
        description={`Set fulfillment progress for order ${selectedOrder?.id}`}
      >
        <div className="space-y-4 pt-2">
          <Select
            label="Order Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={[
              { label: 'Pending Payment / Approval', value: 'Pending' },
              { label: 'Processing in Warehouse', value: 'Processing' },
              { label: 'Shipped with Courier', value: 'Shipped' },
              { label: 'Delivered to Customer', value: 'Delivered' },
              { label: 'Cancelled / Refunded', value: 'Cancelled' },
            ]}
          />

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            {selectedOrder?.status !== 'Cancelled' ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  handleCancelOrder(selectedOrder);
                }}
              >
                Cancel Order
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(false)}>
                Close
              </Button>
              <Button size="sm" isLoading={isSubmitting} onClick={handleUpdateStatus}>
                Save Status
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Order Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Order Details: ${selectedOrder?.id}`}
        description={`Placed on ${formatDate(selectedOrder?.date, { hour: '2-digit', minute: '2-digit' })}`}
        maxWidth="max-w-lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {selectedOrder.paymentMethod || 'Credit Card'}
              </span>
            </div>

            {/* Customer Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-800">Customer Details</span>
              <p className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</p>
              <p className="text-slate-500">{selectedOrder.customerEmail}</p>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-800">Order Items</span>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku} &bull; Qty: {item.quantity} &times; {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (8% Sales Tax)</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span>{formatCurrency(selectedOrder.shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-indigo-600">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDetailsOpen(false);
                  setNewStatus(selectedOrder.status);
                  setIsStatusModalOpen(true);
                }}
              >
                Change Status
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => setIsDetailsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
