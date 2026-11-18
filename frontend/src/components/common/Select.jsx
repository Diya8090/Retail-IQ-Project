import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  ({ className, label, error, helperText, options = [], children, placeholder = 'Select an option', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          <select
            ref={ref}
            className={cn(
              'flex h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-1 pr-8 text-sm text-slate-900 transition-colors',
              'focus-visible:outline-none focus-visible:border-indigo-600 focus-visible:ring-1 focus-visible:ring-indigo-600',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
              error && 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500 text-rose-900',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
