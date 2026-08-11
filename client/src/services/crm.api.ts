import type { ApiSuccessResponse } from '../types/api';
import type { Customer, CustomerDetail, CustomerFollowup } from '../types/crm';
import { http } from './http';

export const crmApi = {
  listCustomers: async (params: Record<string, unknown>) => {
    const response = await http.get<ApiSuccessResponse<Customer[]>>('/customers', { params });
    return {
      items: response.data.data,
      total: Number(response.data.meta?.total ?? 0),
      page: Number(response.data.meta?.page ?? 1),
      limit: Number(response.data.meta?.limit ?? 10),
    };
  },
  getCustomer: async (id: string) => {
    const response = await http.get<ApiSuccessResponse<CustomerDetail>>(`/customers/${id}`);
    return response.data.data;
  },
  createCustomer: async (payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<Customer>>('/customers', payload);
    return response.data.data;
  },
  updateCustomer: async (id: string, payload: Record<string, unknown>) => {
    const response = await http.put<ApiSuccessResponse<Customer>>(`/customers/${id}`, payload);
    return response.data.data;
  },
  createFollowup: async (id: string, payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<CustomerFollowup>>(`/customers/${id}/followups`, payload);
    return response.data.data;
  },
};

