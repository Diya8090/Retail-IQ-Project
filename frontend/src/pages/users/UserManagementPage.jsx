import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserCog,
  Plus,
  Search,
  ShieldCheck,
  Store,
  LineChart,
  Lock,
  Edit,
  Power,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { DataTable } from '@/components/tables/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { userManagementSchema } from '@/validations';
import { formatDate } from '@/utils/formatters';

export const UserManagementPage = () => {
  const { role, switchRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Store Manager',
      department: 'Store Logistics',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(userManagementSchema),
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(search);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'Admin') {
      loadUsers();
    }
  }, [search, role]);

  // Access Control Guard
  if (role !== 'Admin') {
    return (
      <div className="py-12 max-w-lg mx-auto text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Lock className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          User Management and internal RBAC assignments are restricted to users with the <span className="font-semibold text-purple-700">Admin</span> role. Your current active role is <span className="font-semibold text-slate-700">{role}</span>.
        </p>
        <div className="pt-2">
          <Button icon={ShieldCheck} onClick={() => switchRole('Admin')}>
            Switch to Admin Role (Demo Preview)
          </Button>
        </div>
      </div>
    );
  }

  const openEditModal = (u) => {
    setSelectedUser(u);
    setEditValue('name', u.name);
    setEditValue('email', u.email);
    setEditValue('role', u.role);
    setEditValue('department', u.department);
    setIsEditModalOpen(true);
  };

  const onAddUser = async (data) => {
    try {
      setIsSubmitting(true);
      await userService.createUser(data);
      resetAdd();
      setIsAddModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditUser = async (data) => {
    try {
      setIsSubmitting(true);
      await userService.updateUser(selectedUser.id, data);
      setIsEditModalOpen(false);
      await loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await userService.toggleUserStatus(user.id);
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <ShieldCheck className="h-3 w-3" /> Admin
          </span>
        );
      case 'Store Manager':
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <Store className="h-3 w-3" /> Store Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <LineChart className="h-3 w-3" /> Sales Analyst
          </span>
        );
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}`}
            alt={row.name}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
          <div>
            <span className="font-semibold text-slate-900">{row.name}</span>
            <p className="text-[11px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role & Permissions',
      sortable: true,
      render: (row) => getRoleBadge(row.role),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => <span className="text-slate-600 text-xs">{row.department}</span>,
    },
    {
      key: 'status',
      label: 'Account Status',
      align: 'center',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
      ),
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (row) => <span className="text-slate-500 text-xs">{row.lastActive}</span>,
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
            title="Edit user privileges"
          >
            <Edit className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleToggleStatus(row)}
            title={row.status === 'Active' ? 'Deactivate user' : 'Activate user'}
          >
            <Power
              className={`h-4 w-4 ${
                row.status === 'Active'
                  ? 'text-emerald-600 hover:text-rose-600'
                  : 'text-slate-400 hover:text-emerald-600'
              }`}
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Access Management"
        subtitle="Provision internal team accounts, assign granular role authorizations, and audit login access."
        breadcrumbs={['Other', 'User Management']}
      >
        <Button size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Team Member
        </Button>
      </PageHeader>

      {/* Search Input */}
      <div className="max-w-md bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
        <Input
          placeholder="Search team members by name, email or role..."
          leadingIcon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching authorization records..." className="h-64" />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          pageSize={8}
          emptyTitle="No team members found"
          emptyDescription="Add staff members using the button above."
        />
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Invite New Team Member"
        description="Assign a corporate role and departmental access permission."
      >
        <form onSubmit={handleAddSubmit(onAddUser)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Jordan Hayes"
            error={addErrors.name?.message}
            {...registerAdd('name')}
          />

          <Input
            label="Corporate Email"
            type="email"
            placeholder="jordan@retailiq.io"
            error={addErrors.email?.message}
            {...registerAdd('email')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Role"
              options={[
                { label: 'Admin (Full Privileges)', value: 'Admin' },
                { label: 'Store Manager (Inventory/Orders)', value: 'Store Manager' },
                { label: 'Sales Analyst (Analytics/Reports)', value: 'Sales Analyst' },
              ]}
              {...registerAdd('role')}
            />
            <Input
              label="Department"
              placeholder="e.g. Procurement"
              error={addErrors.department?.message}
              {...registerAdd('department')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Invite Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff Account"
        description="Update role privileges or departmental alignment."
      >
        <form onSubmit={handleEditSubmit(onEditUser)} className="space-y-4">
          <Input
            label="Full Name"
            error={editErrors.name?.message}
            {...registerEdit('name')}
          />

          <Input
            label="Corporate Email"
            type="email"
            error={editErrors.email?.message}
            {...registerEdit('email')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Role"
              options={[
                { label: 'Admin (Full Privileges)', value: 'Admin' },
                { label: 'Store Manager (Inventory/Orders)', value: 'Store Manager' },
                { label: 'Sales Analyst (Analytics/Reports)', value: 'Sales Analyst' },
              ]}
              {...registerEdit('role')}
            />
            <Input
              label="Department"
              error={editErrors.department?.message}
              {...registerEdit('department')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Privileges
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
