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

async function createFixtureData() {
  const admin = await pool.query(`SELECT id FROM users WHERE email = 'admin@fundsroom.local'`);
  const userId = admin.rows[0].id;

  const customer = await pool.query(
    `
      INSERT INTO customers (name, mobile, email, business_name, customer_type, address, status, created_by)
      VALUES ('Fixture Customer', '9999999999', 'fixture@example.com', 'Fixture Co', 'WHOLESALE', 'Delhi', 'ACTIVE', $1)
      RETURNING id
    `,
    [userId]
  );

  const product = await pool.query(
    `
      INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location)
      VALUES ('Fixture Product', 'FIX-001', 'General', 300, 10, 2, 'A-1')
      RETURNING id
    `
  );

  return {
    customerId: customer.rows[0].id as string,
    productId: product.rows[0].id as string,
  };
}

describeDb('challan integration', () => {
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

  it('creates draft, confirms safely, prevents duplicate confirmation, and restores stock on cancel', async () => {
    const token = await login('sales@fundsroom.local');
    const { customerId, productId } = await createFixtureData();

    const create = await request(app)
      .post('/api/v1/challans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId,
        items: [{ productId, quantity: 4 }],
      });

    expect(create.status).toBe(201);
    expect(create.body.data.items[0].snapshot_product_name).toBe('Fixture Product');
    const challanId = create.body.data.challan.id as string;

    const confirm = await request(app)
      .post(`/api/v1/challans/${challanId}/confirm`)
      .set('Authorization', `Bearer ${token}`);
    expect(confirm.status).toBe(200);

    const duplicate = await request(app)
      .post(`/api/v1/challans/${challanId}/confirm`)
      .set('Authorization', `Bearer ${token}`);
    expect(duplicate.status).toBe(409);

    const cancel = await request(app)
      .post(`/api/v1/challans/${challanId}/cancel`)
      .set('Authorization', `Bearer ${token}`);
    expect(cancel.status).toBe(200);

    const product = await pool.query(`SELECT current_stock FROM products WHERE id = $1`, [productId]);
    expect(product.rows[0].current_stock).toBe(10);
  });
});

