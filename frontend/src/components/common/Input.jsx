import React from 'react';
import { cn } from '@/utils/cn';

export const Input = React.forwardRef(
  ({ className, type = 'text', label, error, helperText, leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {LeadingIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <LeadingIcon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
              'focus-visible:outline-none focus-visible:border-indigo-600 focus-visible:ring-1 focus-visible:ring-indigo-600',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
              LeadingIcon && 'pl-9',
              TrailingIcon && 'pr-9',
              error && 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500 text-rose-900',
              className
            )}
            {...props}
          />
          {TrailingIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {TrailingIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
