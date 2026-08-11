import type { ReactNode } from 'react';
import { Card } from './Card';

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint: string }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{hint}</p>
    </Card>
  );
}

