import type { PoolClient } from 'pg';
import { query } from '../config/database.js';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';
}

export class UserRepository {
  async findByEmail(email: string, client?: PoolClient): Promise<UserRecord | null> {
    const result = await (client
      ? client.query<UserRecord>(
          `
            SELECT id, email, password_hash, full_name, role
            FROM users
            WHERE email = $1
          `,
          [email]
        )
      : query<UserRecord>(
          `
            SELECT id, email, password_hash, full_name, role
            FROM users
            WHERE email = $1
          `,
          [email]
        ));

    return result.rows[0] ?? null;
  }

  async create(
    email: string,
    passwordHash: string,
    fullName: string,
    role: 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS',
    client?: PoolClient
  ): Promise<UserRecord> {
    const result = await (client
      ? client.query<UserRecord>(
          `
            INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, full_name, role
          `,
          [email, passwordHash, fullName, role]
        )
      : query<UserRecord>(
          `
            INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, full_name, role
          `,
          [email, passwordHash, fullName, role]
        ));

    return result.rows[0];
  }
}
