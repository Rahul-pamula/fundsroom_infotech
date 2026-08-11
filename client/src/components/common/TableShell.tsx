import type { ReactNode } from 'react';

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">{children}</div>;
}

