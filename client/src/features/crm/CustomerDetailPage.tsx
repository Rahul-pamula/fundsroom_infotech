import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { crmApi } from '../../services/crm.api';
import { formatDate, formatDateTime } from '../../utils/format';
import { CustomerEditModal } from './CustomerEditModal';

interface FollowupFormValues {
  note: string;
  followUpDate?: string;
  status?: 'LEAD' | 'ACTIVE' | 'INACTIVE';
}

export function CustomerDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const canManage = usePermission(['ADMIN', 'SALES']);
  const { pushToast } = useToast();
  const { register, handleSubmit, reset } = useForm<FollowupFormValues>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const customerQuery = useQuery({
    queryKey: ['customer', id],
    queryFn: () => crmApi.getCustomer(id),
    enabled: Boolean(id),
  });

  const followupMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => crmApi.createFollowup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      pushToast('Follow-up added');
      reset();
    },
    onError: () => pushToast('Could not add follow-up', 'error'),
  });

  if (customerQuery.isLoading) {
    return <Loader />;
  }

  if (customerQuery.isError || !customerQuery.data) {
    return <ErrorState title="Could not load customer details." />;
  }

  const customer = customerQuery.data;

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{customer.business_name}</h2>
            <p className="text-sm text-slate-500">
              {customer.name} · {customer.mobile} · {customer.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={customer.status} />
            {canManage ? (
              <Button className="bg-slate-100 hover:bg-slate-200 !text-slate-700" onClick={() => setIsEditOpen(true)}>
                Edit Profile
              </Button>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Customer Type</p><p className="mt-1 font-semibold text-slate-900">{customer.customer_type}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Next Follow-up</p><p className="mt-1 font-semibold text-slate-900">{formatDate(customer.follow_up_date)}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-500">GST</p><p className="mt-1 font-semibold text-slate-900">{customer.gst_number || 'Not provided'}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-slate-500">Address</p><p className="mt-1 font-semibold text-slate-900">{customer.address}</p></div>
        </div>
      </Card>

      {canManage ? (
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Add Follow-up</h3>
          <form
            className="mt-4 grid gap-4 md:grid-cols-3"
            onSubmit={handleSubmit(async (values) => followupMutation.mutateAsync({ ...values }))}
          >
            <Textarea className="md:col-span-3" placeholder="Call notes, next steps, objections..." rows={4} {...register('note')} />
            <Input type="date" {...register('followUpDate')} />
            <Select {...register('status')}>
              <option value="">Keep status unchanged</option>
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
            <div className="flex items-center">
              <Button disabled={followupMutation.isPending} type="submit">Save Follow-up</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card>
        <h3 className="text-lg font-bold text-slate-900">Follow-up Timeline</h3>
        <div className="mt-4 space-y-4">
          {customer.followups.length > 0 ? (
            customer.followups.map((followup) => (
              <div key={followup.id} className="border-l-2 border-slate-200 pl-4 py-1">
                <p className="text-xs text-slate-400">{formatDateTime(followup.created_at)} by {followup.created_by_name}</p>
                <p className="mt-1 text-sm text-slate-700">{followup.note}</p>
                {followup.follow_up_date ? (
                  <p className="mt-1 text-xs text-brand-600 font-semibold">Scheduled next follow-up: {formatDate(followup.follow_up_date)}</p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No follow-ups recorded yet.</p>
          )}
        </div>
      </Card>

      {isEditOpen ? (
        <CustomerEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          customer={customer}
        />
      ) : null}
    </div>
  );
}
