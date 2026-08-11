import { describe, expect, it, vi } from 'vitest';
import { usePermission } from '../hooks/usePermission';
import { useAuth } from '../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('usePermission hook permissions', () => {
  it('returns true if the user role is included in allowed roles', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', fullName: 'Admin User', role: 'ADMIN' },
      token: 'mock-token',
      login: async () => {},
      logout: () => {},
      isAuthenticated: true,
    });

    const hasPermission = usePermission(['ADMIN', 'SALES']);
    expect(hasPermission).toBe(true);
  });

  it('returns false if the user role is not included in allowed roles', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '2', email: 'sales@test.com', fullName: 'Sales User', role: 'SALES' },
      token: 'mock-token',
      login: async () => {},
      logout: () => {},
      isAuthenticated: true,
    });

    const hasPermission = usePermission(['ADMIN']);
    expect(hasPermission).toBe(false);
  });

  it('returns false if the user is unauthenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      login: async () => {},
      logout: () => {},
      isAuthenticated: false,
    });

    const hasPermission = usePermission(['ADMIN', 'SALES']);
    expect(hasPermission).toBe(false);
  });
});
