import React from 'react';
import { Card } from '@/components/common/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive' | 'negative' | 'neutral'
  period = 'vs. last month',
  icon: Icon,
  iconColor = 'text-indigo-600 bg-indigo-50 border-indigo-100',
  description,
  className,
}) => {
  const isPositive = changeType === 'positive' || (typeof change === 'number' && change > 0);
  const isNegative = changeType === 'negative' || (typeof change === 'number' && change < 0);

  return (
    <Card className={cn('p-5 transition-all hover:shadow-md hover:border-slate-300', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{value}</div>
        </div>
        {Icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl border', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded-md text-xs',
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : isNegative
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
          </span>
        )}
        <span className="text-slate-400 font-normal">{period}</span>
      </div>

      {description && <p className="mt-2 text-xs text-slate-400">{description}</p>}
    </Card>
  );
};
