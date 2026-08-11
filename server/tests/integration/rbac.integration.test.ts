import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { pool } from '../../src/config/database.js';
import { closeDatabase, isDbTestEnabled, resetDatabase, seedUsers } from '../helpers/db.js';

const describeDb = isDbTestEnabled ? describe : describe.skip;

async function login(email: string) {
  let role = 'SALES';
  if (email.startsWith('admin')) role = 'ADMIN';
  else if (email.startsWith('warehouse')) role = 'WAREHOUSE';
  else if (email.startsWith('accounts')) role = 'ACCOUNTS';

  const response = await request(app).post('/api/v1/auth/login').send({
    email,
    password: 'Password123!',
    role,
  });
  return response.body.data.token as string;
}

describeDb('rbac integration', () => {
  beforeAll(async () => {
    await resetDatabase();
    await seedUsers();
  });

  beforeEach(async () => {
    await resetDatabase();
    await seedUsers();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('forbids sales from creating products', async () => {
    const token = await login('sales@fundsroom.local');
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Restricted Product',
        sku: 'REST-001',
        category: 'General',
        unitPrice: 100,
        currentStock: 5,
        minStockAlert: 1,
        location: 'A-1',
      });

    expect(response.status).toBe(403);
  });

  it('allows admin to create products', async () => {
    const token = await login('admin@fundsroom.local');
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Allowed Product',
        sku: 'ALLOW-001',
        category: 'General',
        unitPrice: 100,
        currentStock: 5,
        minStockAlert: 1,
        location: 'A-1',
      });

    expect(response.status).toBe(201);
    const count = await pool.query(`SELECT COUNT(*)::int AS total FROM products`);
    expect(count.rows[0].total).toBe(1);
  });
});

