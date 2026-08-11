import type { ReactNode } from 'react';

const tones: Record<string, string> = {
  LEAD: 'bg-amber-100 text-amber-900',
  ACTIVE: 'bg-emerald-100 text-emerald-900',
  INACTIVE: 'bg-slate-200 text-slate-800',
  DRAFT: 'bg-sky-100 text-sky-900',
  CONFIRMED: 'bg-emerald-100 text-emerald-900',
  CANCELLED: 'bg-rose-100 text-rose-900',
  IN: 'bg-emerald-100 text-emerald-900',
  OUT: 'bg-rose-100 text-rose-900',
};

export function Badge({ label }: { label: ReactNode }) {
  const key = String(label);
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[key] ?? 'bg-slate-100 text-slate-800'}`}>{label}</span>;
}

