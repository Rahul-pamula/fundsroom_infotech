import type { ApiSuccessResponse } from '../types/api';
import type { ChallanDetail, ChallanListItem } from '../types/challans';
import { http } from './http';

export const challansApi = {
  list: async (params: Record<string, unknown>) => {
    const response = await http.get<ApiSuccessResponse<ChallanListItem[]>>('/challans', { params });
    return {
      items: response.data.data,
      total: Number(response.data.meta?.total ?? 0),
      page: Number(response.data.meta?.page ?? 1),
      limit: Number(response.data.meta?.limit ?? 10),
    };
  },
  getById: async (id: string) => {
    const response = await http.get<ApiSuccessResponse<ChallanDetail>>(`/challans/${id}`);
    return response.data.data;
  },
  create: async (payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<ChallanDetail>>('/challans', payload);
    return response.data.data;
  },
  confirm: async (id: string) => {
    const response = await http.post<ApiSuccessResponse<ChallanDetail>>(`/challans/${id}/confirm`);
    return response.data.data;
  },
  cancel: async (id: string) => {
    const response = await http.post<ApiSuccessResponse<ChallanDetail>>(`/challans/${id}/cancel`);
    return response.data.data;
  },
};

