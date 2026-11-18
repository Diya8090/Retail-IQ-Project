import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  Boxes,
  Users,
  ShoppingCart,
  TrendingUp,
  BrainCircuit,
  UserX,
  FileText,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Store,
  LineChart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) => {
  const { user, role, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navigationGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Management',
      items: [
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Categories', href: '/categories', icon: Layers },
        { name: 'Inventory', href: '/inventory', icon: Boxes },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Orders', href: '/orders', icon: ShoppingCart },
        { name: 'Sales', href: '/sales', icon: TrendingUp },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        {
          name: 'Demand Forecasting',
          href: '/forecasting',
          icon: BrainCircuit,
          badge: 'AI ML',
        },
        {
          name: 'Customer Churn',
          href: '/churn',
          icon: UserX,
          badge: 'AI ML',
        },
      ],
    },
    {
      title: 'Other',
      items: [
        { name: 'Reports', href: '/reports', icon: FileText },
        ...(role === 'Admin'
          ? [{ name: 'User Management', href: '/users', icon: UserCog, adminOnly: true }]
          : []),
        { name: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    Admin: 'bg-purple-100 text-purple-700 border-purple-200',
    'Store Manager': 'bg-blue-100 text-blue-700 border-blue-200',
    'Sales Analyst': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-18' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200 text-white font-bold tracking-wider">
              <Sparkles className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                  Retail<span className="text-indigo-600">IQ</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
                  Enterprise SaaS
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          isCollapsed && 'justify-center px-2'
                        )
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                      {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="rounded-md bg-indigo-100/70 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile & Role Switcher Footer */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/50 relative">
          {/* Quick Role Switcher Dropdown */}
          {showRoleMenu && !isCollapsed && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 text-xs">
              <p className="px-2 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Demo Role Switcher
              </p>
              <button
                onClick={() => {
                  switchRole('Admin');
                  setShowRoleMenu(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors',
                  role === 'Admin' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                Admin (Full Access)
              </button>
              <button
                onClick={() => {
                  switchRole('Store Manager');
                  setShowRoleMenu(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors',
                  role === 'Store Manager' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <Store className="h-3.5 w-3.5 text-blue-600" />
                Store Manager
              </button>
              <button
                onClick={() => {
                  switchRole('Sales Analyst');
                  setShowRoleMenu(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors',
                  role === 'Sales Analyst' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <LineChart className="h-3.5 w-3.5 text-emerald-600" />
                Sales Analyst
              </button>
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-3',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2.5 overflow-hidden cursor-pointer select-none',
                !isCollapsed && 'hover:opacity-80 transition-opacity'
              )}
              onClick={() => !isCollapsed && setShowRoleMenu(!showRoleMenu)}
              title={isCollapsed ? `${user?.name} (${role})` : 'Click to switch role'}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-semibold text-slate-900 leading-tight">
                    {user?.name || 'Alex Rivera'}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.2 rounded border',
                        roleColors[role] || 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {role}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
