import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:bg-indigo-800 focus-visible:ring-indigo-500',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs focus-visible:ring-slate-300',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:bg-rose-800 focus-visible:ring-rose-500',
  outline: 'border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
  link: 'text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-500 p-0 h-auto',
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-base rounded-lg gap-2.5',
  icon: 'h-9 w-9 p-0 rounded-lg justify-center',
  'icon-sm': 'h-8 w-8 p-0 rounded-md justify-center',
};

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, icon: Icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : Icon ? (
          <Icon className={cn('h-4 w-4 shrink-0', size === 'sm' ? 'h-3.5 w-3.5' : '')} />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
