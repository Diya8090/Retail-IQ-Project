import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          'relative z-10 w-full overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all duration-200 border border-slate-200/80 my-8',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900 leading-snug">{title}</h3>}
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};
