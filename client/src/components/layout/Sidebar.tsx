import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth';

const links: Array<{ to: string; label: string; roles: UserRole[] }> = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
  { to: '/customers', label: 'Customers', roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
  { to: '/products', label: 'Products', roles: ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'] },
  { to: '/stock-movements', label: 'Stock Movements', roles: ['ADMIN', 'WAREHOUSE'] },
  { to: '/challans', label: 'Challans', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="border-r border-white/60 bg-slate-925 px-6 py-8 text-white">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Fundsroom Infotech</p>
        <h2 className="mt-3 text-2xl font-bold">Ops Command</h2>
        <p className="mt-2 text-sm text-slate-300">Sales, stock, and customer workflows in one place.</p>
      </div>
      <nav className="space-y-2">
        {links
          .filter((link) => (user ? link.roles.includes(user.role) : false))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}

