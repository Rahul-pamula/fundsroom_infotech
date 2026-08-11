import { Link } from 'react-router-dom';
import { Card } from '../common/Card';

export function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6V9m0 12a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 font-sans">403 Access Denied</h2>
          <p className="text-sm text-slate-500">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 no-underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
