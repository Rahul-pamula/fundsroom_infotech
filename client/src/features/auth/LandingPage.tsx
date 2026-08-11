import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/85 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-brand-600"></span>
            <span className="text-xl font-bold tracking-tight text-slate-900">OpsCommand</span>
          </div>
          <nav className="hidden space-x-8 md:flex">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand-600 no-underline">Features</a>
            <a href="#workflow" className="text-sm font-semibold text-slate-600 hover:text-brand-600 no-underline">Workflow</a>
            <a href="#roles" className="text-sm font-semibold text-slate-600 hover:text-brand-600 no-underline">Roles</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-600 no-underline">Sign In</Link>
            <Link to="/signup" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 no-underline">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Mini ERP + CRM Platform</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Manage Your Business Operations From Customers to Inventory to Sales.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            A modern Operations Portal built specifically for wholesale and distribution businesses to streamline CRM logs, master product catalogs, and verify sales challan fulfillments.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/login" className="rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-brand-700 no-underline">
              Access Portal
            </Link>
            <a href="#features" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 no-underline">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section id="features" className="border-t border-slate-200 bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Engineered for Wholesale & Distribution</h2>
            <p className="mt-4 text-slate-500">Essential enterprise modules for absolute stock integrity and auditable follow-ups.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Customer CRM</h3>
              <p className="mt-2 text-sm text-slate-500">Track client lifecycles from Leads to Active. Record immutable follow-up notes and schedule dates.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Inventory Catalog</h3>
              <p className="mt-2 text-sm text-slate-500">Manage master product listings, warehouse locations, alert thresholds, and pricing snapshots.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Sales Challans</h3>
              <p className="mt-2 text-sm text-slate-500">Draft dispatch requests, check stock levels, capture static product snapshots, and confirm fulfillment.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Transaction-Safe Operations</h3>
              <p className="mt-2 text-sm text-slate-500">Row-level pessimistic locking (`FOR NO KEY UPDATE`) guarantees stock balances never fall below zero.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Immutable Ledger</h3>
              <p className="mt-2 text-sm text-slate-500">Auditable logs for every manual stock adjustment, return dispatch, or confirmed order fulfillment.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Role-Based Access</h3>
              <p className="mt-2 text-sm text-slate-500">Granular view configurations and route protections for Admins, Sales Agents, Warehouse Ops, and Accounts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow section */}
      <section id="workflow" className="border-t border-slate-200 bg-slate-50/50 px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Unified Operations Workflow</h2>
            <p className="mt-4 text-slate-500">The seamless progression of customers and orders inside the portal.</p>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-bold">1</div>
              <h4 className="mt-4 font-bold text-slate-900">CRM Lead</h4>
              <p className="mt-1 max-w-[200px] text-xs text-slate-500">Qualify contacts and capture follow-ups.</p>
            </div>
            <div className="hidden h-0.5 w-16 bg-slate-300 md:block"></div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-bold">2</div>
              <h4 className="mt-4 font-bold text-slate-900">Draft Challan</h4>
              <p className="mt-1 max-w-[200px] text-xs text-slate-500">Build orders and snapshot catalog items.</p>
            </div>
            <div className="hidden h-0.5 w-16 bg-slate-300 md:block"></div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-bold">3</div>
              <h4 className="mt-4 font-bold text-slate-900">Stock Locks</h4>
              <p className="mt-1 max-w-[200px] text-xs text-slate-500">PostgreSQL locks verify stock levels atomically.</p>
            </div>
            <div className="hidden h-0.5 w-16 bg-slate-300 md:block"></div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-bold">4</div>
              <h4 className="mt-4 font-bold text-slate-900">Fulfillment</h4>
              <p className="mt-1 max-w-[200px] text-xs text-slate-500">Deduct inventory and publish ledger updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role section */}
      <section id="roles" className="border-t border-slate-200 bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Role-Specific Workspace Views</h2>
            <p className="mt-4 text-slate-500">Targeted tools to make every business operator faster.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900">ADMIN</h4>
              <p className="mt-2 text-xs text-slate-500">Full operational oversight. Catalog editing, user provisioning settings, and global auditing ledger logs.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900">SALES</h4>
              <p className="mt-2 text-xs text-slate-500">Qualify CRM accounts, insert client communication logs, and build sales drafts for warehouses.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900">WAREHOUSE</h4>
              <p className="mt-2 text-xs text-slate-500">Conduct manual inventory intake adjustments, verify bin locations, and confirm sales dispatches.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900">ACCOUNTS</h4>
              <p className="mt-2 text-xs text-slate-500">Inspect historical challan snapshots and view inventory levels for financial audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-brand-700 px-6 py-20 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to simplify your operations?</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Sign in to start managing your workflow scenarios.
          </p>
          <div className="mt-8">
            <Link to="/login" className="rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-brand-700 shadow hover:bg-brand-50 no-underline">
              Access Operations Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} OpsCommand. All rights reserved.</p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link to="/login" className="hover:text-brand-600 no-underline">Sign In</Link>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
