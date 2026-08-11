import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema } from '../../src/models/auth.js';
import { challanSchema } from '../../src/models/challan.js';
import { customerSchema } from '../../src/models/customer.js';
import { adjustStockSchema, productSchema } from '../../src/models/product.js';

describe('validation schemas', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({
      email: 'sales@fundsroom.local',
      password: 'Password123!',
      role: 'SALES',
    });

    expect(result.success).toBe(true);
  });

  it('rejects login payload with missing role', () => {
    const result = loginSchema.safeParse({
      email: 'sales@fundsroom.local',
      password: 'Password123!',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid customer email payloads', () => {
    const result = customerSchema.safeParse({
      name: 'Rohit',
      mobile: '9876543210',
      email: 'invalid-email',
      businessName: 'Acme Traders',
      customerType: 'WHOLESALE',
      address: 'Mumbai',
      status: 'LEAD',
    });

    expect(result.success).toBe(false);
  });

  it('rejects negative stock adjustments', () => {
    const result = adjustStockSchema.safeParse({
      quantity: -3,
      movementType: 'OUT',
      reason: 'Bad request',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid product payloads', () => {
    const result = productSchema.safeParse({
      name: 'Industrial Solvent',
      sku: 'SOLV-1',
      category: 'Chemicals',
      unitPrice: 100,
      currentStock: 5,
      minStockAlert: 2,
      location: 'A-1',
    });

    expect(result.success).toBe(true);
  });

  it('requires at least one challan item', () => {
    const result = challanSchema.safeParse({
      customerId: '7a2b86b9-bcd3-45da-9280-015d771f4910',
      items: [],
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid signup payload and normalizes email', () => {
    const payload = {
      name: 'John Doe',
      email: 'JOHN@EXAMPLE.COM',
      password: 'Password123!',
    };
    const result = signupSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('john@example.com');
    }
  });

  it('rejects weak signup passwords', () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    };
    const result = signupSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
