import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No data found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 my-4">
      <div className="rounded-full bg-slate-100 p-3 mb-3 text-slate-500">
        <Icon className="h-6 w-6 stroke-[1.5]" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction} icon={actionIcon}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
