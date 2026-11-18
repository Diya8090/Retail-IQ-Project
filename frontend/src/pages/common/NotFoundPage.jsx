import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-7xl font-extrabold text-indigo-600 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-900">Page not found</h2>
        <p className="text-xs text-slate-500">
          The requested page could not be located on the RetailIQ platform. Please verify the URL or return to the main dashboard.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button size="sm" icon={Home} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
