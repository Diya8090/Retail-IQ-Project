import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  Download,
  DollarSign,
  TrendingUp,
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
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { productSchema } from '@/validations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals & Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      description: '',
      sellingPrice: '',
      costPrice: '',
      currentStock: 0,
      minimumStock: 10,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getProducts({
          search,
          category: selectedCategory,
          status: selectedStatus,
        }),
        categoryService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, selectedStatus]);

  // Open Edit Modal
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditValue('name', product.name);
    setEditValue('sku', product.sku);
    setEditValue('category', product.category);
    setEditValue('description', product.description);
    setEditValue('sellingPrice', product.sellingPrice);
    setEditValue('costPrice', product.costPrice);
    setEditValue('currentStock', product.currentStock);
    setEditValue('minimumStock', product.minimumStock);
    setIsEditModalOpen(true);
  };

  // Submit Add Product
  const onAddProduct = async (data) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct(data);
      resetAdd();
      setIsAddModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Product
  const onEditProduct = async (data) => {
    try {
      setIsSubmitting(true);
      await productService.updateProduct(selectedProduct.id, data);
      setIsEditModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete Product
  const onDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      setIsSubmitting(true);
      await productService.deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'Low Stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge variant="danger">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExport = () => {
    exportToCSV('retailiq-products', products, [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Product Name' },
      { key: 'category', label: 'Category' },
      { key: 'sellingPrice', label: 'Selling Price ($)' },
      { key: 'costPrice', label: 'Cost Price ($)' },
      { key: 'currentStock', label: 'Stock Level' },
      { key: 'status', label: 'Status' },
      { key: 'totalSold', label: 'Units Sold' },
    ]);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 leading-tight">{row.name}</span>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {row.sku}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => <span className="text-slate-600">{row.category}</span>,
    },
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold text-slate-900">{formatCurrency(row.sellingPrice)}</span>,
    },
    {
      key: 'costPrice',
      label: 'Cost',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-slate-500">{formatCurrency(row.costPrice)}</span>,
    },
    {
      key: 'currentStock',
      label: 'Stock Level',
      sortable: true,
      align: 'center',
      render: (row) => (
        <div className="flex flex-col items-center">
          <span
            className={`font-bold ${
              row.currentStock === 0
                ? 'text-rose-600'
                : row.currentStock <= row.minimumStock
                ? 'text-amber-600'
                : 'text-slate-800'
            }`}
          >
            {row.currentStock}
          </span>
          <span className="text-[10px] text-slate-400">Min: {row.minimumStock}</span>
        </div>
      ),
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
              setSelectedProduct(row);
              setIsDetailsOpen(true);
            }}
            title="View details"
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openEditModal(row)}
            title="Edit product"
          >
            <Edit className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedProduct(row);
              setIsDeleteModalOpen(true);
            }}
            title="Delete product"
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
        title="Product Inventory"
        subtitle="Manage SKU catalog, pricing thresholds, active stock levels, and product descriptions."
        breadcrumbs={['Management', 'Products']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
            Export CSV
          </Button>
          <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Product
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by product name, SKU or keyword..."
            leadingIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[
            { label: 'All Categories', value: 'All' },
            ...categories.map((c) => ({ label: c.name, value: c.name })),
          ]}
        />

        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          options={[
            { label: 'All Stock Statuses', value: 'All' },
            { label: 'In Stock', value: 'In Stock' },
            { label: 'Low Stock', value: 'Low Stock' },
            { label: 'Out of Stock', value: 'Out of Stock' },
          ]}
        />
      </div>

      {/* Product Data Table */}
      {loading ? (
        <LoadingSpinner text="Fetching product records..." className="h-64" />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          pageSize={8}
          emptyTitle="No products match your criteria"
          emptyDescription="Try clearing your search terms or filters to view other inventory items."
          emptyAction={{
            label: 'Add New Product',
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Retail Product"
        description="Fill in the product details to add a new SKU to the catalog."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddSubmit(onAddProduct)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g. Aeroflow Smart Diffuser"
              error={addErrors.name?.message}
              {...registerAdd('name')}
            />
            <Input
              label="SKU Identifier"
              placeholder="e.g. HK-ASD-013"
              error={addErrors.sku?.message}
              {...registerAdd('sku')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              error={addErrors.category?.message}
              options={categories.map((c) => ({ label: c.name, value: c.name }))}
              {...registerAdd('category')}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Selling Price ($)"
                type="number"
                step="0.01"
                placeholder="49.99"
                error={addErrors.sellingPrice?.message}
                {...registerAdd('sellingPrice')}
              />
              <Input
                label="Cost Price ($)"
                type="number"
                step="0.01"
                placeholder="22.50"
                error={addErrors.costPrice?.message}
                {...registerAdd('costPrice')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Initial Stock"
              type="number"
              placeholder="50"
              error={addErrors.currentStock?.message}
              {...registerAdd('currentStock')}
            />
            <Input
              label="Minimum Restock Level"
              type="number"
              placeholder="15"
              error={addErrors.minimumStock?.message}
              {...registerAdd('minimumStock')}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Product Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Detailed description of features, materials, and target audience..."
              {...registerAdd('description')}
            />
            {addErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{addErrors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        description="Update pricing, thresholds, or specification details for this product."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleEditSubmit(onEditProduct)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              error={editErrors.name?.message}
              {...registerEdit('name')}
            />
            <Input
              label="SKU Identifier"
              error={editErrors.sku?.message}
              {...registerEdit('sku')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              error={editErrors.category?.message}
              options={categories.map((c) => ({ label: c.name, value: c.name }))}
              {...registerEdit('category')}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Selling Price ($)"
                type="number"
                step="0.01"
                error={editErrors.sellingPrice?.message}
                {...registerEdit('sellingPrice')}
              />
              <Input
                label="Cost Price ($)"
                type="number"
                step="0.01"
                error={editErrors.costPrice?.message}
                {...registerEdit('costPrice')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Stock Units"
              type="number"
              error={editErrors.currentStock?.message}
              {...registerEdit('currentStock')}
            />
            <Input
              label="Minimum Restock Level"
              type="number"
              error={editErrors.minimumStock?.message}
              {...registerEdit('minimumStock')}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Product Description
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              {...registerEdit('description')}
            />
            {editErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{editErrors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        description="Are you sure you want to remove this product from the inventory database? This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <strong>Warning:</strong> Deleting{' '}
            <span className="font-semibold">{selectedProduct?.name}</span> (SKU: {selectedProduct?.sku})
            will remove it from active listing and new orders.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" isLoading={isSubmitting} onClick={onDeleteProduct}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Product Details Drawer */}
      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Product Inspection"
        description={`SKU: ${selectedProduct?.sku}`}
        maxWidth="max-w-lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {selectedProduct.category}
                </span>
                {getStatusBadge(selectedProduct.status)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProduct.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Financial Margin Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <span className="text-xs font-semibold text-slate-700">Financial Margins & Unit Economics</span>
              <div className="grid grid-cols-3 gap-2 text-left">
                <div>
                  <span className="text-[10px] text-slate-400">Selling Price</span>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(selectedProduct.sellingPrice)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Cost Price</span>
                  <p className="text-sm font-bold text-slate-600">{formatCurrency(selectedProduct.costPrice)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Gross Margin</span>
                  <p className="text-sm font-bold text-emerald-600">
                    {Math.round(
                      ((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.sellingPrice) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory Status Breakdown */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <span className="text-xs font-semibold text-slate-700">Stock Velocity & Inventory</span>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400">Units in Warehouse</span>
                  <p className="text-lg font-bold text-slate-900">{selectedProduct.currentStock} units</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400">Minimum Buffer</span>
                  <p className="text-lg font-bold text-slate-900">{selectedProduct.minimumStock} units</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400">Total Units Sold</span>
                  <p className="text-lg font-bold text-indigo-600">{selectedProduct.totalSold || 0} units</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400">Inventory Valuation</span>
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(selectedProduct.currentStock * selectedProduct.costPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDetailsOpen(false);
                  openEditModal(selectedProduct);
                }}
              >
                Edit Product
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setIsDetailsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
