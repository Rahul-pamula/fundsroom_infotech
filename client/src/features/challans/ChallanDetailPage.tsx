import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TableShell } from '../../components/common/TableShell';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { challansApi } from '../../services/challans.api';
import { formatCurrency, formatDateTime } from '../../utils/format';

export function ChallanDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const canConfirm = usePermission(['ADMIN', 'SALES', 'WAREHOUSE']);
  const canCancel = usePermission(['ADMIN', 'SALES']);

  const challanQuery = useQuery({
    queryKey: ['challan', id],
    queryFn: () => challansApi.getById(id),
    enabled: Boolean(id),
  });

  const confirmMutation = useMutation({
    mutationFn: () => challansApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challan', id] });
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      pushToast('Challan confirmed');
    },
    onError: () => pushToast('Could not confirm challan', 'error'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => challansApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challan', id] });
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      pushToast('Challan cancelled');
    },
    onError: () => pushToast('Could not cancel challan', 'error'),
  });

  if (challanQuery.isLoading) {
    return <Loader />;
  }

  if (challanQuery.isError || !challanQuery.data) {
    return <ErrorState title="Could not load challan." />;
  }

  const { challan, items } = challanQuery.data;
  const isDraft = challan.status === 'DRAFT';

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Challan Detail</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{challan.challan_number}</h2>
            <p className="mt-2 text-sm text-slate-500">{challan.business_name} · {challan.customer_name} · {challan.mobile}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={challan.status} />
            {isDraft && canConfirm ? <Button disabled={confirmMutation.isPending} onClick={() => confirmMutation.mutate()} type="button">Confirm</Button> : null}
            {canCancel ? <Button className="bg-rose-600 hover:bg-rose-700" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()} type="button">Cancel</Button> : null}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Created</p><p className="mt-1 font-semibold text-slate-900">{formatDateTime(challan.created_at)}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Confirmed At</p><p className="mt-1 font-semibold text-slate-900">{formatDateTime(challan.confirmed_at)}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Total Quantity</p><p className="mt-1 font-semibold text-slate-900">{challan.total_quantity}</p></div>
        </div>
      </Card>

      <TableShell>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Snapshot Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Quantity</th>
              <th className="px-5 py-3 font-medium">Snapshot Unit Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 font-semibold text-slate-900">{item.snapshot_product_name}</td>
                <td className="px-5 py-4 text-slate-700">{item.snapshot_sku}</td>
                <td className="px-5 py-4 text-slate-700">{item.quantity}</td>
                <td className="px-5 py-4 text-slate-700">{formatCurrency(item.snapshot_unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
