import type { ReactNode } from 'react';
import { Card } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Content */}
      <div className="relative w-full max-w-2xl z-10">
        <Card className="max-h-[90vh] overflow-y-auto space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="py-2">{children}</div>
        </Card>
      </div>
    </div>
  );
}
