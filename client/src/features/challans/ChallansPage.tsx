import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { TableShell } from '../../components/common/TableShell';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { Loader } from '../../components/feedback/Loader';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { challansApi } from '../../services/challans.api';
import { crmApi } from '../../services/crm.api';
import { inventoryApi } from '../../services/inventory.api';
import { formatDateTime } from '../../utils/format';

interface ChallanItemInput {
  productId: string;
  quantity: number;
}

interface ChallanFormValues {
  customerId: string;
  items: ChallanItemInput[];
}

export function ChallansPage() {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const canCreate = usePermission(['ADMIN', 'SALES']);
  const [status, setStatus] = useState('');

  const { register, control, handleSubmit, reset, watch } = useForm<ChallanFormValues>({
    defaultValues: {
      customerId: '',
      items: [{ productId: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const challansQuery = useQuery({
    queryKey: ['challans', status],
    queryFn: () => challansApi.list({ page: 1, limit: 20, status: status || undefined }),
  });

  const customersQuery = useQuery({
    queryKey: ['challan-customers'],
    queryFn: () => crmApi.listCustomers({ page: 1, limit: 100 }),
  });

  const productsQuery = useQuery({
    queryKey: ['challan-products'],
    queryFn: () => inventoryApi.listProducts({ page: 1, limit: 100 }),
  });

  const createChallan = useMutation({
    mutationFn: challansApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      pushToast('Draft challan created');
      reset({ customerId: '', items: [{ productId: '', quantity: 1 }] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      const msg = err?.response?.data?.error?.message || 'Could not create challan';
      pushToast(msg, 'error');
    },
  });

  const onSubmit = async (values: ChallanFormValues) => {
    // Basic validations
    if (!values.customerId) {
      pushToast('Please select a customer', 'error');
      return;
    }
    if (values.items.length === 0) {
      pushToast('Please add at least one product item', 'error');
      return;
    }

    const productIds = values.items.map((i) => i.productId);
    const hasDuplicates = productIds.some((id, index) => productIds.indexOf(id) !== index);
    if (hasDuplicates) {
      pushToast('Duplicate products are not allowed in the same challan', 'error');
      return;
    }

    const hasEmptyProduct = values.items.some((i) => !i.productId);
    if (hasEmptyProduct) {
      pushToast('Please select a product for all rows', 'error');
      return;
    }

    const hasInvalidQty = values.items.some((i) => !i.quantity || i.quantity <= 0);
    if (hasInvalidQty) {
      pushToast('Quantity must be greater than zero', 'error');
      return;
    }

    await createChallan.mutateAsync(values as unknown as Record<string, unknown>);
  };

  // Watch items array to calculate total quantity in real-time
  const watchedItems = watch('items') || [];
  const totalQuantity = watchedItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

  // Helper to get product stock preview
  const getProductStock = (productId: string) => {
    const product = productsQuery.data?.items.find((p) => p.id === productId);
    return product ? product.current_stock : null;
  };

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Challans</h2>
          <p className="text-sm text-slate-500">Create draft dispatches, confirm them safely, and preserve product snapshots.</p>
        </div>
        <Select className="max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </Card>

      {canCreate ? (
        <Card className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Create Draft Challan</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Customer Select */}
            <div className="max-w-md">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Customer</label>
              <Select {...register('customerId')}>
                <option value="">Select customer</option>
                {customersQuery.data?.items.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.business_name} ({customer.name})
                  </option>
                ))}
              </Select>
            </div>

            {/* Dynamic Product Rows */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-500">Product Items</label>
              {fields.map((field, index) => {
                const selectedProdId = watchedItems[index]?.productId;
                const availableStock = getProductStock(selectedProdId);
                const reqQty = Number(watchedItems[index]?.quantity) || 0;
                const isOverStock = availableStock !== null && reqQty > availableStock;

                return (
                  <div key={field.id} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Select {...register(`items.${index}.productId` as const)}>
                        <option value="">Select product</option>
                        {productsQuery.data?.items.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-full sm:w-32">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                      />
                    </div>

                    {selectedProdId ? (
                      <div className="flex h-10 items-center px-2 text-xs">
                        <span className={isOverStock ? 'font-semibold text-rose-600' : 'text-slate-500'}>
                          Stock: {availableStock} {isOverStock ? '(Insufficient)' : ''}
                        </span>
                      </div>
                    ) : null}

                    {fields.length > 1 ? (
                      <Button
                        type="button"
                        className="bg-rose-50 hover:bg-rose-100 !text-rose-600 self-start sm:self-auto"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Form Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <Button
                type="button"
                className="bg-slate-100 hover:bg-slate-200 !text-slate-700"
                onClick={() => append({ productId: '', quantity: 1 })}
              >
                + Add Product
              </Button>

              <div className="flex items-center gap-6">
                <span className="text-sm font-semibold text-slate-700">
                  Total Quantity: <span className="text-slate-900">{totalQuantity}</span>
                </span>
                <Button disabled={createChallan.isPending} type="submit">
                  {createChallan.isPending ? 'Creating Draft...' : 'Create Draft'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      ) : null}

      {challansQuery.isLoading ? <Loader /> : null}
      {challansQuery.isError ? <ErrorState title="Could not load challans." /> : null}

      {challansQuery.data && challansQuery.data.items.length > 0 ? (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Challan</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {challansQuery.data.items.map((challan) => (
                <tr key={challan.id}>
                  <td className="px-5 py-4">
                    <Link
                      className="font-semibold text-brand-700 no-underline hover:text-brand-800"
                      to={`/challans/${challan.id}`}
                    >
                      {challan.challan_number}
                    </Link>
                    <p className="text-slate-500">{challan.created_by_name}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{challan.business_name}</td>
                  <td className="px-5 py-4 text-slate-700">{challan.total_quantity}</td>
                  <td className="px-5 py-4">
                    <Badge label={challan.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-500">{formatDateTime(challan.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : null}

      {challansQuery.data && challansQuery.data.items.length === 0 ? (
        <EmptyState title="No challans found." />
      ) : null}
    </div>
  );
}
