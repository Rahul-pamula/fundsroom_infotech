import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Operations Portal</p>
          <h1 className="text-xl font-bold text-slate-900">Mini ERP + CRM</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

