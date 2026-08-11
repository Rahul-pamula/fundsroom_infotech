import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

