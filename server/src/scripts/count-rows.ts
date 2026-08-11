import { pool } from '../config/database.js';

const run = async () => {
  const tables = [
    'users',
    'customers',
    'customer_followups',
    'products',
    'stock_movements',
    'challans',
    'challan_items'
  ];

  console.log('--- SUPABASE ROW COUNT VERIFICATION ---');
  for (const table of tables) {
    const res = await pool.query(`SELECT COUNT(*)::int as count FROM ${table}`);
    console.log(`${table}: ${res.rows[0].count} rows`);
  }
  console.log('----------------------------------------');
  await pool.end();
};

run().catch(async (error) => {
  console.error(error);
  await pool.end();
});
