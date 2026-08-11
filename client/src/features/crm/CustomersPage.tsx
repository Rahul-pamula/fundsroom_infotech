import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { TableShell } from '../../components/common/TableShell';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { useDebounce } from '../../hooks/useDebounce';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { crmApi } from '../../services/crm.api';
import { formatDate } from '../../utils/format';

const schema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(7),
  email: z.string().email(),
  businessName: z.string().min(2),
  gstNumber: z.string().optional(),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  address: z.string().min(5),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CustomersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const canManage = usePermission(['ADMIN', 'SALES']);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerType: 'RETAIL',
      status: 'LEAD',
    },
  });

  const customersQuery = useQuery({
    queryKey: ['customers', debouncedSearch, status],
    queryFn: () => crmApi.listCustomers({ search: debouncedSearch, status: status || undefined, page: 1, limit: 10 }),
  });

  const createCustomer = useMutation({
    mutationFn: crmApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      pushToast('Customer created');
      reset();
    },
    onError: () => pushToast('Could not create customer', 'error'),
  });

  const onSubmit = async (values: FormValues) => {
    await createCustomer.mutateAsync(values);
  };

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer CRM</h2>
          <p className="text-sm text-slate-500">Search, qualify, and follow up on leads and active customers.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Search by name, business, or mobile" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="LEAD">Lead</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </div>
      </Card>

      {canManage ? (
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Add Customer</h3>
          <form className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Contact name" {...register('name')} />
            <Input placeholder="Mobile" {...register('mobile')} />
            <Input placeholder="Email" {...register('email')} />
            <Input placeholder="Business name" {...register('businessName')} />
            <Input placeholder="GST number" {...register('gstNumber')} />
            <Select {...register('customerType')}>
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </Select>
            <Select {...register('status')}>
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
            <Input type="date" {...register('followUpDate')} />
            <Input className="md:col-span-2 xl:col-span-2" placeholder="Address" {...register('address')} />
            <Input className="md:col-span-2 xl:col-span-2" placeholder="Notes" {...register('notes')} />
            <div className="md:col-span-2 xl:col-span-4">
              <Button disabled={isSubmitting || createCustomer.isPending} type="submit">
                Create Customer
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {customersQuery.isLoading ? <Loader /> : null}
      {customersQuery.isError ? <ErrorState title="Could not load customers." /> : null}

      {customersQuery.data && customersQuery.data.items.length > 0 ? (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Business</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Follow-up</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {customersQuery.data.items.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{customer.name}</p>
                    <p className="text-slate-500">{customer.mobile}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{customer.business_name}</td>
                  <td className="px-5 py-4"><Badge label={customer.status} /></td>
                  <td className="px-5 py-4 text-slate-700">{formatDate(customer.follow_up_date)}</td>
                  <td className="px-5 py-4">
                    <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => navigate(`/customers/${customer.id}`)} type="button">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : null}

      {customersQuery.data && customersQuery.data.items.length === 0 ? <EmptyState title="No customers matched your filters." /> : null}
    </div>
  );
}

