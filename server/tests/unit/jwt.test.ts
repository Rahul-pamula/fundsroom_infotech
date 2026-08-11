import { describe, expect, it } from 'vitest';
import { signToken, verifyToken } from '../../src/utils/jwt.js';

describe('jwt utilities', () => {
  it('signs and verifies tokens', () => {
    const token = signToken({
      id: 'user-1',
      email: 'admin@fundsroom.local',
      fullName: 'Admin User',
      role: 'ADMIN',
    });

    const payload = verifyToken(token);

    expect(payload.email).toBe('admin@fundsroom.local');
    expect(payload.role).toBe('ADMIN');
  });
});

