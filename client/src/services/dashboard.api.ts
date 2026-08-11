import type { ApiSuccessResponse } from '../types/api';
import type { DashboardSummary } from '../types/dashboard';
import { http } from './http';

export const dashboardApi = {
  getSummary: async () => {
    const response = await http.get<ApiSuccessResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data;
  },
};

