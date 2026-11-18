import React from 'react';
import { cn } from '@/utils/cn';

const badgeVariants = {
  default: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  secondary: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  info: 'bg-sky-50 text-sky-700 border-sky-200/60',
  outline: 'text-slate-600 border-slate-200 bg-transparent',
};

export const Badge = ({ className, variant = 'default', children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
