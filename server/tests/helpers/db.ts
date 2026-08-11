import { pool } from '../../src/config/database.js';
import { hashPassword } from '../../src/utils/password.js';

export const isDbTestEnabled = process.env.RUN_DB_TESTS === 'true';

export const resetDatabase = async () => {
  await pool.query('TRUNCATE TABLE stock_movements, challan_items, challans, customer_followups, customers, products, users RESTART IDENTITY CASCADE');
};

export const seedUsers = async () => {
  const passwordHash = await hashPassword('Password123!');
  const users = [
    ['admin@fundsroom.local', passwordHash, 'Admin User', 'ADMIN'],
    ['sales@fundsroom.local', passwordHash, 'Sales User', 'SALES'],
    ['warehouse@fundsroom.local', passwordHash, 'Warehouse User', 'WAREHOUSE'],
    ['accounts@fundsroom.local', passwordHash, 'Accounts User', 'ACCOUNTS'],
  ];

  for (const user of users) {
    await pool.query(
      `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
      `,
      user
    );
  }
};

export const closeDatabase = async () => {
  await pool.end();
};

