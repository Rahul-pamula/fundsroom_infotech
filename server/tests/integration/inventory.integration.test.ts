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

describeDb('inventory integration', () => {
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

  it('supports stock in and prevents negative stock out', async () => {
    const adminToken = await login('admin@fundsroom.local');
    const warehouseToken = await login('warehouse@fundsroom.local');

    const create = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Hydraulic Clamp',
        sku: 'HYD-CLAMP-1',
        category: 'Hardware',
        unitPrice: 250,
        currentStock: 3,
        minStockAlert: 1,
        location: 'R-1',
      });
    const productId = create.body.data.id as string;

    const stockIn = await request(app)
      .post(`/api/v1/products/${productId}/adjust-stock`)
      .set('Authorization', `Bearer ${warehouseToken}`)
      .send({ quantity: 2, movementType: 'IN', reason: 'Cycle count correction' });
    expect(stockIn.status).toBe(200);

    const stockOutFail = await request(app)
      .post(`/api/v1/products/${productId}/adjust-stock`)
      .set('Authorization', `Bearer ${warehouseToken}`)
      .send({ quantity: 20, movementType: 'OUT', reason: 'Bad issue' });
    expect(stockOutFail.status).toBe(409);

    const product = await pool.query(`SELECT current_stock FROM products WHERE id = $1`, [productId]);
    expect(product.rows[0].current_stock).toBe(5);
  });
});

