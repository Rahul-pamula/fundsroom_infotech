import { useQuery } from '@tanstack/react-query';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { TableShell } from '../../components/common/TableShell';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { inventoryApi } from '../../services/inventory.api';
import { formatDateTime } from '../../utils/format';

export function StockMovementsPage() {
  const movementsQuery = useQuery({
    queryKey: ['stock-movements'],
    queryFn: inventoryApi.listStockMovements,
  });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-slate-900">Stock Movements</h2>
        <p className="text-sm text-slate-500">Immutable ledger for every inventory change.</p>
      </Card>

      {movementsQuery.isLoading ? <Loader /> : null}
      {movementsQuery.isError ? <ErrorState title="Could not load stock movements." /> : null}

      {movementsQuery.data && movementsQuery.data.length > 0 ? (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Movement</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {movementsQuery.data.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{movement.product_name}</p>
                    <p className="text-slate-500">{movement.sku}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Badge label={movement.movement_type} />
                      <span className="font-semibold text-slate-900">{movement.quantity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{movement.reason}</td>
                  <td className="px-5 py-4 text-slate-700">{movement.created_by_name}</td>
                  <td className="px-5 py-4 text-slate-500">{formatDateTime(movement.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : null}

      {movementsQuery.data && movementsQuery.data.length === 0 ? <EmptyState title="No stock movements recorded yet." /> : null}
    </div>
  );
}

