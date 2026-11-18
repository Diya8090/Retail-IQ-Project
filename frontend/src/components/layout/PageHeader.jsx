import React from 'react';
import { cn } from '@/utils/cn';

export const PageHeader = ({
  title,
  subtitle,
  children,
  badge,
  breadcrumbs,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 pt-1 border-b border-slate-200/60 mb-6',
        className
      )}
    >
      <div className="space-y-1">
        {breadcrumbs && (
          <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-slate-700' : 'hover:text-slate-900'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">{subtitle}</p>}
      </div>

      {children && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{children}</div>}
    </div>
  );
};
