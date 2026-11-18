import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit, Trash2, Layers, Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { DataTable } from '@/components/tables/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { categoryService } from '@/services/categoryService';
import { categorySchema } from '@/validations';
import { formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csv';

export const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Active',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories(search);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setEditValue('name', cat.name);
    setEditValue('description', cat.description);
    setEditValue('status', cat.status);
    setIsEditModalOpen(true);
  };

  const onAddCategory = async (data) => {
    try {
      setIsSubmitting(true);
      await categoryService.createCategory(data);
      resetAdd();
      setIsAddModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditCategory = async (data) => {
    try {
      setIsSubmitting(true);
      await categoryService.updateCategory(selectedCategory.id, data);
      setIsEditModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await categoryService.deleteCategory(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      await loadCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    exportToCSV('retailiq-categories', categories, [
      { key: 'name', label: 'Category Name' },
      { key: 'description', label: 'Description' },
      { key: 'productCount', label: 'Product Count' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created At' },
    ]);
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-xs shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900">{row.name}</span>
            <p className="text-[11px] text-slate-400 font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => <span className="text-slate-600 text-xs line-clamp-1 max-w-md">{row.description}</span>,
    },
    {
      key: 'productCount',
      label: 'Assigned Products',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {row.productCount || 0} products
        </span>
      ),
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
      key: 'createdAt',
      label: 'Created Date',
      render: (row) => <span className="text-slate-500 text-xs">{formatDate(row.createdAt)}</span>,
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
            onClick={() => openEditModal(row)}
            title="Edit category"
          >
            <Edit className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCategory(row);
              setIsDeleteModalOpen(true);
            }}
            title="Delete category"
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
        title="Product Categories"
        subtitle="Organize retail inventory taxonomy, departmental groupings, and catalog hierarchies."
        breadcrumbs={['Management', 'Categories']}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
            Export CSV
          </Button>
          <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Category
          </Button>
        </div>
      </PageHeader>

      {/* Search Input */}
      <div className="max-w-md bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
        <Input
          placeholder="Search categories by name or keyword..."
          leadingIcon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading category taxonomies..." className="h-64" />
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          pageSize={10}
          emptyTitle="No categories found"
          emptyDescription="Create your first product department category above."
        />
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Product Category"
        description="Create a new classification category for products in your store."
      >
        <form onSubmit={handleAddSubmit(onAddCategory)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Footwear & Shoes"
            error={addErrors.name?.message}
            {...registerAdd('name')}
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Summary of products included in this group..."
              {...registerAdd('description')}
            />
            {addErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{addErrors.description.message}</p>
            )}
          </div>

          <Select
            label="Category Status"
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            {...registerAdd('status')}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        description="Update category name, description, or activation status."
      >
        <form onSubmit={handleEditSubmit(onEditCategory)} className="space-y-4">
          <Input
            label="Category Name"
            error={editErrors.name?.message}
            {...registerEdit('name')}
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              {...registerEdit('description')}
            />
            {editErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{editErrors.description.message}</p>
            )}
          </div>

          <Select
            label="Category Status"
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            {...registerEdit('status')}
          />

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

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        description="Are you sure you want to remove this category? Products currently assigned will become uncategorized."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600">
            Category to remove: <span className="font-semibold text-slate-900">{selectedCategory?.name}</span>
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" isLoading={isSubmitting} onClick={onDeleteCategory}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
