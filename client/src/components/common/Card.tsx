import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-3xl border border-white/60 bg-white/90 p-6 shadow-soft', className)}>{children}</div>;
}

