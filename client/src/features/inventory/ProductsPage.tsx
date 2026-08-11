import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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
import { useDebounce } from '../../hooks/useDebounce';
import { inventoryApi } from '../../services/inventory.api';
import { formatCurrency } from '../../utils/format';
import { ProductEditModal } from './ProductEditModal';
import type { Product } from '../../types/inventory';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const canCreate = usePermission(['ADMIN']);
  const canAdjust = usePermission(['ADMIN', 'WAREHOUSE']);
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search);

  // Edit modal state
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const productForm = useForm<{
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    minStockAlert: number;
    location: string;
  }>({
    defaultValues: {
      minStockAlert: 10,
      currentStock: 0,
    },
  });

  const adjustForm = useForm<{
    movementType: 'IN' | 'OUT';
    quantity: number;
    reason: string;
  }>({
    defaultValues: {
      movementType: 'IN',
      quantity: 1,
    },
  });

  const productsQuery = useQuery({
    queryKey: ['products', debouncedSearch, category],
    queryFn: () =>
      inventoryApi.listProducts({
        search: debouncedSearch || undefined,
        category: category || undefined,
        page: 1,
        limit: 100, // Fetch large enough list for pagination simplified view
      }),
  });

  const createProduct = useMutation({
    mutationFn: inventoryApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      pushToast('Product created');
      productForm.reset({ minStockAlert: 10, currentStock: 0 });
    },
    onError: () => pushToast('Could not create product', 'error'),
  });

  const adjustStock = useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) =>
      inventoryApi.adjustStock(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      pushToast('Stock updated');
      adjustForm.reset({ movementType: 'IN', quantity: 1 });
    },
    onError: () => pushToast('Stock adjustment failed', 'error'),
  });

  // Extract unique categories from loaded products for the filter
  const allProductsQuery = useQuery({
    queryKey: ['all-products-for-categories'],
    queryFn: () => inventoryApi.listProducts({ page: 1, limit: 200 }),
  });
  const categories = Array.from(
    new Set(allProductsQuery.data?.items.map((p) => p.category) || [])
  );

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products & Inventory</h2>
          <p className="text-sm text-slate-500">Manage catalog items, stock balances, and low-stock risks.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Search products by name/SKU..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {canCreate ? (
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Add Product</h3>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={productForm.handleSubmit(async (values) => createProduct.mutateAsync(values))}
          >
            <Input placeholder="Product name" {...productForm.register('name')} />
            <Input placeholder="SKU" {...productForm.register('sku')} />
            <Input placeholder="Category" {...productForm.register('category')} />
            <Input
              type="number"
              step="0.01"
              placeholder="Unit price"
              {...productForm.register('unitPrice', { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Current stock"
              {...productForm.register('currentStock', { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Low-stock threshold"
              {...productForm.register('minStockAlert', { valueAsNumber: true })}
            />
            <Input placeholder="Location" {...productForm.register('location')} />
            <div className="flex items-center">
              <Button disabled={createProduct.isPending} type="submit">
                Create Product
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {canAdjust ? (
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Adjust Stock</h3>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={adjustForm.handleSubmit(async (values) => {
              if (!selectedProductId) {
                pushToast('Choose a product first', 'error');
                return;
              }
              await adjustStock.mutateAsync({ id: selectedProductId, data: values });
            })}
          >
            <Select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
              <option value="">Select product</option>
              {productsQuery.data?.items.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </Select>
            <Select {...adjustForm.register('movementType')}>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </Select>
            <Input type="number" {...adjustForm.register('quantity', { valueAsNumber: true })} />
            <Input placeholder="Reason" {...adjustForm.register('reason')} />
            <div className="md:col-span-2 xl:col-span-4">
              <Button disabled={adjustStock.isPending} type="submit">
                Apply Adjustment
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {productsQuery.isLoading ? <Loader /> : null}
      {productsQuery.isError ? <ErrorState title="Could not load products." /> : null}

      {productsQuery.data && productsQuery.data.items.length > 0 ? (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Unit Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Location</th>
                {canCreate ? <th className="px-5 py-3 font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {productsQuery.data.items.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-slate-500">{product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{product.category}</td>
                  <td className="px-5 py-4 text-slate-700">{formatCurrency(product.unit_price)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{product.current_stock}</span>
                      {product.current_stock <= product.min_stock_alert ? <Badge label="LOW" /> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{product.location}</td>
                  {canCreate ? (
                    <td className="px-5 py-4">
                      <Button
                        className="bg-slate-100 hover:bg-slate-200 !text-slate-700 text-xs py-1 px-3"
                        onClick={() => setEditProduct(product)}
                      >
                        Edit
                      </Button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : null}

      {productsQuery.data && productsQuery.data.items.length === 0 ? (
        <EmptyState title="No products found." />
      ) : null}

      {editProduct ? (
        <ProductEditModal
          isOpen={Boolean(editProduct)}
          onClose={() => setEditProduct(null)}
          product={editProduct}
        />
      ) : null}
    </div>
  );
}
