import type { ApiSuccessResponse } from '../types/api';
import type { LoginPayload, LoginResponse } from '../types/auth';
import { http } from './http';

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await http.post<ApiSuccessResponse<LoginResponse>>('/auth/login', payload);
    return response.data.data;
  },
  signup: async (payload: Record<string, unknown>) => {
    const response = await http.post<ApiSuccessResponse<unknown>>('/auth/signup', payload);
    return response.data.data;
  },
};
