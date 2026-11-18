import React from 'react';
import { cn } from '@/utils/cn';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-xs transition-shadow',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-base font-semibold leading-tight tracking-tight text-slate-900', className)} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-slate-500 font-normal', className)} {...props}>
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-5 pt-0 border-t border-slate-100 mt-4', className)} {...props}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
