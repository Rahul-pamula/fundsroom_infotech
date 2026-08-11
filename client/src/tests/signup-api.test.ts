import { describe, expect, it, vi } from 'vitest';
import { authApi } from '../services/auth.api';
import { http } from '../services/http';

vi.mock('../services/http', () => ({
  http: {
    post: vi.fn(),
  },
}));

describe('authApi signup service client', () => {
  it('calls POST /auth/signup with payload and returns user info', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    vi.mocked(http.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          user: {
            id: 'mock-uuid',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'SALES',
          },
        },
      },
    });

    const result = await authApi.signup(payload);
    expect(http.post).toHaveBeenCalledWith('/auth/signup', payload);
    expect(result).toEqual({
      user: {
        id: 'mock-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'SALES',
      },
    });
  });
});
