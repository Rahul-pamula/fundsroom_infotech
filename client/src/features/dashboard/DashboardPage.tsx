import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { dashboardApi } from '../../services/dashboard.api';
import { formatDateTime } from '../../utils/format';

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <ErrorState title="Could not load dashboard summary." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Customers" value={data.totals.customers} hint="Total accounts in CRM" />
        <StatCard label="Active Customers" value={data.totals.activeCustomers} hint="Ready for live business" />
        <StatCard label="Products" value={data.totals.products} hint="Inventory catalog items" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Low Stock Alerts</h2>
              <p className="text-sm text-slate-500">Products at or below alert threshold.</p>
            </div>
            <Badge label={`${data.lowStockProducts.length} flagged`} />
          </div>
          <div className="space-y-3">
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.sku}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-rose-600">{product.current_stock} left</p>
                    <p className="text-slate-500">Alert at {product.min_stock_alert}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-500">Latest stock and challan events.</p>
          </div>
          <div className="space-y-3">
            {data.recentActivity.map((item, index) => (
              <div key={`${item.type}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <Badge label={item.type} />
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

