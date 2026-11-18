import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        )}
      >
        {/* Top Navbar */}
        <Navbar openMobile={() => setIsMobileOpen(true)} />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
