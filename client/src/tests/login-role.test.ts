import { describe, expect, it, vi } from 'vitest';
import { authApi } from '../services/auth.api';
import { http } from '../services/http';

vi.mock('../services/http', () => ({
  http: {
    post: vi.fn(),
  },
}));

describe('authApi login service client', () => {
  it('calls POST /auth/login with email, password, and selected role', async () => {
    const payload = {
      email: 'admin@fundsroom.local',
      password: 'Password123!',
      role: 'ADMIN' as const,
    };

    vi.mocked(http.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 'mock-id',
            email: 'admin@fundsroom.local',
            fullName: 'Admin User',
            role: 'ADMIN',
          },
        },
      },
    });

    const result = await authApi.login(payload);
    expect(http.post).toHaveBeenCalledWith('/auth/login', payload);
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.role).toBe('ADMIN');
  });
});
