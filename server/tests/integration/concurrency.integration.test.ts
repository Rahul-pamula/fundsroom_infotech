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

async function setupSharedInventory() {
  const admin = await pool.query(`SELECT id FROM users WHERE email = 'admin@fundsroom.local'`);
  const userId = admin.rows[0].id;

  const customer = await pool.query(
    `
      INSERT INTO customers (name, mobile, email, business_name, customer_type, address, status, created_by)
      VALUES ('Concurrent Customer', '9999999999', 'concurrent@example.com', 'Concurrent Co', 'WHOLESALE', 'Delhi', 'ACTIVE', $1)
      RETURNING id
    `,
    [userId]
  );

  const product = await pool.query(
    `
      INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location)
      VALUES ('Shared Product', 'SHARED-001', 'General', 300, 5, 1, 'A-1')
      RETURNING id
    `
  );

  return {
    customerId: customer.rows[0].id as string,
    productId: product.rows[0].id as string,
  };
}

describeDb('challan concurrency integration', () => {
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

  it('allows only one overlapping confirmation to succeed when stock is insufficient for both', async () => {
    const token = await login('sales@fundsroom.local');
    const { customerId, productId } = await setupSharedInventory();

    const first = await request(app)
      .post('/api/v1/challans')
      .set('Authorization', `Bearer ${token}`)
      .send({ customerId, items: [{ productId, quantity: 4 }] });

    const second = await request(app)
      .post('/api/v1/challans')
      .set('Authorization', `Bearer ${token}`)
      .send({ customerId, items: [{ productId, quantity: 4 }] });

    const [confirmA, confirmB] = await Promise.all([
      request(app).post(`/api/v1/challans/${first.body.data.challan.id}/confirm`).set('Authorization', `Bearer ${token}`),
      request(app).post(`/api/v1/challans/${second.body.data.challan.id}/confirm`).set('Authorization', `Bearer ${token}`),
    ]);

    const statuses = [confirmA.status, confirmB.status].sort();
    expect(statuses).toEqual([200, 422]);

    const product = await pool.query(`SELECT current_stock FROM products WHERE id = $1`, [productId]);
    expect(product.rows[0].current_stock).toBe(1);
  });
});

