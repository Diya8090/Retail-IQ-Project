import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Download,
  ShieldAlert,
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
import { customerService } from '@/services/customerService';
import { customerSchema } from '@/validations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers({
        search,
        risk: riskFilter,
        status: statusFilter,
      });
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search, riskFilter, statusFilter]);

  const openEditModal = (c) => {
    setSelectedCustomer(c);
    setEditValue('name', c.name);
    setEditValue('email', c.email);
    setEditValue('phone', c.phone);
    setEditValue('address', c.address);
    setEditValue('city', c.city);
    setIsEditModalOpen(true);
  };

  const onAddCustomer = async (data) => {
    try {
      setIsSubmitting(true);
      await customerService.createCustomer(data);
      resetAdd();
      setIsAddModalOpen(false);
      await loadCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditCustomer = async (data) => {
    try {
      setIsSubmitting(true);
      await customerService.updateCustomer(selectedCustomer.id, data);
      setIsEditModalOpen(false);
      await loadCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      setIsSubmitting(true);
      await customerService.deleteCustomer(selectedCustomer.id);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    exportToCSV('retailiq-customers', customers, [
      { key: 'name', label: 'Customer Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      { key: 'totalOrders', label: 'Total Orders' },
      { key: 'totalSpending', label: 'Total Spending ($)' },
      { key: 'status', label: 'Status' },
      { key: 'churnRisk', label: 'Churn Risk Tier' },
      { key: 'registrationDate', label: 'Registered' },
    ]);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return <Badge variant="danger">High Risk</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium Risk</Badge>;
      default:
        return <Badge variant="success">Low Risk</Badge>;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={
              row.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=6366f1&color=fff`
            }
            alt={row.name}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-semibold text-slate-900 leading-tight">{row.name}</span>
            <p className="text-[11px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      render: (row) => <span className="text-slate-600 text-xs">{row.city || 'United States'}</span>,
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="font-semibold text-slate-800 text-xs">{row.totalOrders} orders</span>
      ),
    },
    {
      key: 'totalSpending',
      label: 'Total Spent',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">{formatCurrency(row.totalSpending)}</span>
      ),
    },
    {
      key: 'churnRisk',
      label: 'Churn Risk',
      align: 'center',
      render: (row) => getRiskBadge(row.churnRisk),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
      ),
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
              setSelectedCustomer(row);
              setIsDetailsOpen(true);
            }}
            title="View customer profile"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openEditModal(row)}
            title="Edit customer"
          >
            <Edit className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCustomer(row);
              setIsDeleteModalOpen(true);
            }}
            title="Delete customer"
          >
            <Trash2 className="h-4 w-4 text-slate-500 hover:text-rose-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        subtitle="Manage client profiles, transaction history, customer lifetime value, and retention."
        breadcrumbs={['Management', 'Customers']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
            Export Customers
          </Button>
          <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Customer
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="sm:col-span-1">
          <Input
            placeholder="Search by name, email, phone or city..."
            leadingIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          options={[
            { label: 'All Churn Risk Tiers', value: 'All' },
            { label: 'Low Risk', value: 'Low' },
            { label: 'Medium Risk', value: 'Medium' },
            { label: 'High Risk', value: 'High' },
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
        />
      </div>

      {/* Customer Data Table */}
      {loading ? (
        <LoadingSpinner text="Loading customer accounts..." className="h-64" />
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          pageSize={10}
          emptyTitle="No customer profiles found"
          emptyDescription="Try clearing your search filters or add a new customer."
        />
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer"
        description="Enter customer profile information to create an account record."
      >
        <form onSubmit={handleAddSubmit(onAddCustomer)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Adams"
            error={addErrors.name?.message}
            {...registerAdd('name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="rachel@example.com"
              error={addErrors.email?.message}
              {...registerAdd('email')}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              error={addErrors.phone?.message}
              {...registerAdd('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                placeholder="123 Market St, Suite 400"
                error={addErrors.address?.message}
                {...registerAdd('address')}
              />
            </div>
            <div>
              <Input
                label="City"
                placeholder="Seattle"
                error={addErrors.city?.message}
                {...registerAdd('city')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
        description="Update contact information and delivery address."
      >
        <form onSubmit={handleEditSubmit(onEditCustomer)} className="space-y-4">
          <Input
            label="Full Name"
            error={editErrors.name?.message}
            {...registerEdit('name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              error={editErrors.email?.message}
              {...registerEdit('email')}
            />
            <Input
              label="Phone Number"
              error={editErrors.phone?.message}
              {...registerEdit('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                error={editErrors.address?.message}
                {...registerEdit('address')}
              />
            </div>
            <div>
              <Input
                label="City"
                error={editErrors.city?.message}
                {...registerEdit('city')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Customer Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer Account"
        description="Are you sure you want to delete this customer record? All associated contact details will be removed."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600">
            Customer: <span className="font-semibold text-slate-900">{selectedCustomer?.name}</span> (
            {selectedCustomer?.email})
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" isLoading={isSubmitting} onClick={onDeleteCustomer}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Customer Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Customer Profile & Lifetime Value"
        description={`ID: ${selectedCustomer?.id}`}
        maxWidth="max-w-md"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedCustomer.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=6366f1&color=fff`
                }
                alt={selectedCustomer.name}
                className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedCustomer.status === 'Active' ? 'success' : 'secondary'}>
                    {selectedCustomer.status}
                  </Badge>
                  {getRiskBadge(selectedCustomer.churnRisk)}
                </div>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</span>
                <p className="text-base font-bold text-indigo-600 mt-0.5">
                  {formatCurrency(selectedCustomer.totalSpending)}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed Orders</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedCustomer.totalOrders} orders
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4 text-xs">
              <span className="font-semibold text-slate-800">Contact & Location</span>
              <div className="space-y-2 pt-1 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {selectedCustomer.address}, {selectedCustomer.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Member since {formatDate(selectedCustomer.registrationDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDetailsOpen(false);
                  openEditModal(selectedCustomer);
                }}
              >
                Edit Customer
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
