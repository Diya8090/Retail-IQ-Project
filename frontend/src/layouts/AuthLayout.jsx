import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Promotional / Feature Showcase Column (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg text-white font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Retail<span className="text-indigo-400">IQ</span></h1>
            <p className="text-xs text-slate-400">Next-Gen Intelligent Retail SaaS</p>
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="space-y-8 relative z-10 my-auto py-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="h-3.5 w-3.5" /> Retail Intelligence Engine
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Manage inventory, optimize sales, and forecast demand effortlessly.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Designed for modern retail chains, e-commerce brands, and multi-channel merchants.
              Turn operational transactions into predictive business growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Predictive</span>
              </div>
              <p className="text-xs text-slate-400">Demand regression & churn prediction ready.</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Enterprise</span>
              </div>
              <p className="text-xs text-slate-400">Role-based controls & audit log tracking.</p>
            </div>
          </div>
        </div>

        {/* Testimonial / Footnote */}
        <div className="relative z-10 border-t border-slate-800/80 pt-6">
          <p className="text-xs text-slate-400 italic">
            "RetailIQ gives our management team complete real-time clarity across inventory, stock movements, and customer revenue trends."
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
              AR
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Alex Rivera</p>
              <p className="text-[10px] text-slate-500">Lead Operations Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form Outlet */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Retail<span className="text-indigo-600">IQ</span>
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
