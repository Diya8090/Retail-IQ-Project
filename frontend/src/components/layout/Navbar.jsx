import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const Navbar = ({ openMobile }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate dynamic breadcrumb title from path
  const pathTitles = {
    '/dashboard': 'Dashboard',
    '/analytics': 'Business Analytics',
    '/products': 'Product Management',
    '/categories': 'Category Management',
    '/inventory': 'Inventory & Stock Movements',
    '/customers': 'Customer Directory',
    '/orders': 'Order Management',
    '/sales': 'Sales Analytics & Revenue',
    '/forecasting': 'AI Demand Forecasting',
    '/churn': 'Customer Churn Intelligence',
    '/reports': 'Reports & Exports',
    '/users': 'User & Access Management',
    '/settings': 'System Settings',
  };

  const currentTitle = pathTitles[location.pathname] || 'RetailIQ Platform';

  const notifications = [
    {
      id: 1,
      title: 'Low stock warning',
      message: 'OmniSmart Watch Series 4 is down to 8 units.',
      time: '15m ago',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 2,
      title: 'Order dispatched',
      message: 'Order #ORD-2025-8840 has been shipped via FedEX.',
      time: '1h ago',
      icon: Package,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 3,
      title: 'Monthly sales milestone',
      message: 'Monthly target reached 114% of projection!',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobile}
          className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Overview / SaaS</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">{currentTitle}</h2>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleGlobalSearch} className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers... (press Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-12 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
          />
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            ⌘K
          </div>
        </div>
      </form>

      {/* Right: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {notifications.map((n) => {
                  const NIcon = n.icon;
                  return (
                    <div key={n.id} className="py-2.5 px-2 hover:bg-slate-50 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer">
                      <div className={cn('p-1.5 rounded-lg shrink-0 mt-0.5', n.color)}>
                        <NIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User'}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">{role}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Account Settings
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
