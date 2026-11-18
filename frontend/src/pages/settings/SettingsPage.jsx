import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  CheckCircle2,
  Lock,
  Mail,
  Camera,
  Save,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/contexts/AuthContext';

export const SettingsPage = () => {
  const { user, role, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'account' | 'notifications' | 'appearance'
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'admin@retailiq.io');
  const [title, setTitle] = useState(user?.title || 'Lead Operations Director');

  // Account Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notifications state
  const [notifications, setNotifications] = useState({
    lowStock: true,
    largeOrders: true,
    dailySummary: false,
    churnAlerts: true,
  });

  // Appearance state
  const [appearanceTheme, setAppearanceTheme] = useState('light');
  const [tableDensity, setTableDensity] = useState('comfortable');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email, title });
    setSuccessMessage('Profile information saved successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill out password fields.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setSuccessMessage('Password updated successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Account & System Settings"
        subtitle="Manage your profile credentials, notification alerts, and application preferences."
        breadcrumbs={['Other', 'Settings']}
      />

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'account'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Security & Password
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'appearance'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          Appearance & Display
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Public Profile</CardTitle>
            <CardDescription>This information is displayed to team members across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <Button type="button" variant="outline" size="sm" icon={Camera}>
                    Change Avatar
                  </Button>
                  <p className="text-[11px] text-slate-400 mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Job Title / Position"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700">Assigned Corporate Role</label>
                  <div className="flex items-center h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-indigo-700">
                    {role} (Granted by Organization Admin)
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button type="submit" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security & Password Tab */}
      {activeTab === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Security Credentials</CardTitle>
            <CardDescription>Manage password authentication and two-factor access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" size="sm" variant="outline">
                Update Password
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">Require an authenticator app code on login</p>
              </div>
              <Button
                variant={twoFactorEnabled ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              >
                {twoFactorEnabled ? 'Enabled (Turn Off)' : 'Enable 2FA'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notification Channels</CardTitle>
            <CardDescription>Choose which automated alerts are delivered to your inbox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">Low Stock Threshold Warnings</p>
                <p className="text-[11px] text-slate-500">Alert immediately when an item hits minimum restock level</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.lowStock}
                onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">Large Order Dispatch Alerts</p>
                <p className="text-[11px] text-slate-500">Notify on high-value orders exceeding $500.00</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.largeOrders}
                onChange={(e) => setNotifications({ ...notifications, largeOrders: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">Customer Churn Escalations</p>
                <p className="text-[11px] text-slate-500">Alert sales team when a VIP client enters high churn risk</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.churnAlerts}
                onChange={(e) => setNotifications({ ...notifications, churnAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </CardContent>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Appearance & System Display</CardTitle>
            <CardDescription>Customize dashboard density and color presentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800">Color Theme</span>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setAppearanceTheme('light')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    appearanceTheme === 'light'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs">Light (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppearanceTheme('dark')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    appearanceTheme === 'dark'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs">Dark Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppearanceTheme('system')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    appearanceTheme === 'system'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Laptop className="h-5 w-5" />
                  <span className="text-xs">System Match</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <Select
                label="Table Spacing Density"
                value={tableDensity}
                onChange={(e) => setTableDensity(e.target.value)}
                options={[
                  { label: 'Comfortable (Standard)', value: 'comfortable' },
                  { label: 'Compact (High Data Density)', value: 'compact' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
