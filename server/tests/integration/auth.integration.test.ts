import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { closeDatabase, isDbTestEnabled, resetDatabase, seedUsers } from '../helpers/db.js';
import { pool } from '../../src/config/database.js';

const describeDb = isDbTestEnabled ? describe : describe.skip;

describeDb('auth integration', () => {
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

  it('logs in with valid credentials and correct role', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@fundsroom.local',
      password: 'Password123!',
      role: 'ADMIN',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.role).toBe('ADMIN');
  });

  it('rejects correct credentials but wrong role selection', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@fundsroom.local',
      password: 'Password123!',
      role: 'SALES', // Correct details but wrong role selected
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Invalid credentials or role.');
  });

  it('rejects invalid credentials', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@fundsroom.local',
      password: 'WrongPassword',
      role: 'ADMIN',
    });

    expect(response.status).toBe(401);
  });

  it('rejects login payload with missing role', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@fundsroom.local',
      password: 'Password123!',
    });

    expect(response.status).toBe(400); // Validation error
  });

  it('signs up successfully with default SALES role', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'New Registered User',
      email: 'newuser@fundsroom.local',
      password: 'Password123!',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.role).toBe('SALES');

    // Confirm DB record
    const dbResult = await pool.query(`SELECT role FROM users WHERE email = $1`, ['newuser@fundsroom.local']);
    expect(dbResult.rows[0].role).toBe('SALES');
  });

  it('ignores client-sent elevated roles and defaults to SALES', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'Hacker User',
      email: 'hacker@fundsroom.local',
      password: 'Password123!',
      role: 'ADMIN',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe('SALES');

    const dbResult = await pool.query(`SELECT role FROM users WHERE email = $1`, ['hacker@fundsroom.local']);
    expect(dbResult.rows[0].role).toBe('SALES');
  });

  it('rejects duplicate emails with 409 Conflict', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: 'Duplicate User',
      email: 'admin@fundsroom.local', // Already seeded
      password: 'Password123!',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});
