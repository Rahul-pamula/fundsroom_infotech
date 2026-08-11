import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface ToastItem {
  id: number;
  title: string;
  tone: 'success' | 'error';
}

interface ToastContextValue {
  pushToast: (title: string, tone?: 'success' | 'error') => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (title: string, tone: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((previous) => [...previous, { id, title, tone }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-soft ${
              toast.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-rose-200 bg-rose-50 text-rose-900'
            }`}
          >
            {toast.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

