import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';

export const DataTable = ({
  columns = [],
  data = [],
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  emptyAction,
  isLoading = false,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Handle pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className={cn('w-full flex flex-col rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 border-collapse">
          <thead className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={cn(
                    'px-4 py-3.5 whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-indigo-600 transition-colors',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.className
                  )}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5',
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    )}
                  >
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-50/80 transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-slate-800 whitespace-nowrap align-middle text-xs font-medium',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                        col.tdClassName
                      )}
                    >
                      {col.render ? col.render(row, idx) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyAction?.label}
                    onAction={emptyAction?.onClick}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 bg-white text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{sortedData.length}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-7 px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Prev
            </Button>
            <span className="px-2 font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-7 px-2"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
