import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { inventoryApi } from '../../services/inventory.api';
import type { Product } from '../../types/inventory';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  category: z.string().min(2, 'Category is required'),
  unitPrice: z.number().min(0, 'Price must be positive'),
  minStockAlert: z.number().min(0, 'Threshold must be positive'),
  location: z.string().min(2, 'Location is required'),
});

type FormValues = z.infer<typeof schema>;

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ProductEditModal({ isOpen, onClose, product }: ProductEditModalProps) {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitPrice: Number(product.unit_price),
      minStockAlert: product.min_stock_alert,
      location: product.location,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => inventoryApi.updateProduct(product.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      pushToast('Product updated successfully');
      onClose();
    },
    onError: () => {
      pushToast('Failed to update product', 'error');
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product Catalog Details">
      <form className="space-y-4" onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Product Name</label>
            <Input {...register('name')} />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">SKU</label>
            <Input {...register('sku')} />
            {errors.sku ? <p className="mt-1 text-xs text-rose-600">{errors.sku.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Category</label>
            <Input {...register('category')} />
            {errors.category ? <p className="mt-1 text-xs text-rose-600">{errors.category.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Unit Price</label>
            <Input type="number" step="0.01" {...register('unitPrice', { valueAsNumber: true })} />
            {errors.unitPrice ? <p className="mt-1 text-xs text-rose-600">{errors.unitPrice.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Min Stock Alert Threshold</label>
            <Input type="number" {...register('minStockAlert', { valueAsNumber: true })} />
            {errors.minStockAlert ? <p className="mt-1 text-xs text-rose-600">{errors.minStockAlert.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Warehouse Location</label>
            <Input {...register('location')} />
            {errors.location ? <p className="mt-1 text-xs text-rose-600">{errors.location.message}</p> : null}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button className="bg-slate-100 hover:bg-slate-200 !text-slate-700" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={updateMutation.isPending} type="submit">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
