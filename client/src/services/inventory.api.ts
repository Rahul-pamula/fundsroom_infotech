import type { ApiSuccessResponse } from '../types/api';
import type { Product, StockMovement } from '../types/inventory';
import { http } from './http';

export const inventoryApi = {
  listProducts: async (params: Record<string, unknown>) => {
    const response = await http.get<ApiSuccessResponse<Product[]>>('/products', { params });
    return {
      items: response.data.data,
      total: Number(response.data.meta?.total ?? 0),
      page: Number(response.data.meta?.page ?? 1),
      limit: Number(response.data.meta?.limit ?? 10),
    };
  },
  createProduct: async (payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<Product>>('/products', payload);
    return response.data.data;
  },
  updateProduct: async (id: string, payload: Record<string, unknown>) => {
    const response = await http.put<ApiSuccessResponse<Product>>(`/products/${id}`, payload);
    return response.data.data;
  },
  adjustStock: async (id: string, payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<Product>>(`/products/${id}/adjust-stock`, payload);
    return response.data.data;
  },
  listStockMovements: async () => {
    const response = await http.get<ApiSuccessResponse<StockMovement[]>>('/stock-movements');
    return response.data.data;
  },
};

