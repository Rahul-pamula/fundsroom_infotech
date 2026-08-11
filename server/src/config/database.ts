import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import dns from 'node:dns';
import { env } from './env.js';

// Supabase IPv4 connection poolers don't have IPv6 records.
// In Node 17+, DNS resolution prioritizes IPv6 by default, which can cause
// random ENOTFOUND errors when pg-pool tries to resolve the connection pooler.
// This forces Node to prefer IPv4.
dns.setDefaultResultOrder('ipv4first');

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export const withTransaction = async <T>(handler: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

