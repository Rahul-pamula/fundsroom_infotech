import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { closeDatabase, isDbTestEnabled, resetDatabase, seedUsers } from '../helpers/db.js';

const describeDb = isDbTestEnabled ? describe : describe.skip;

async function login() {
  const response = await request(app).post('/api/v1/auth/login').send({
    email: 'sales@fundsroom.local',
    password: 'Password123!',
    role: 'SALES',
  });
  return response.body.data.token as string;
}

describeDb('crm integration', () => {
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

  it('creates, searches, updates, and follows up on customers', async () => {
    const token = await login();

    const create = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Anita Rao',
        mobile: '9876543210',
        email: 'anita@example.com',
        businessName: 'Rao Industrial Supplies',
        customerType: 'WHOLESALE',
        address: 'Pune, India',
        status: 'LEAD',
      });

    expect(create.status).toBe(201);
    const customerId = create.body.data.id as string;

    const search = await request(app)
      .get('/api/v1/customers?search=Rao')
      .set('Authorization', `Bearer ${token}`);
    expect(search.status).toBe(200);
    expect(search.body.data).toHaveLength(1);

    const update = await request(app)
      .put(`/api/v1/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ACTIVE' });
    expect(update.status).toBe(200);

    const followup = await request(app)
      .post(`/api/v1/customers/${customerId}/followups`)
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Shared pricing and promised callback', followUpDate: '2026-08-15', status: 'ACTIVE' });
    expect(followup.status).toBe(201);
  });
});

