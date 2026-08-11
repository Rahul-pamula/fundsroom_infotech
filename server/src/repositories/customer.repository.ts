import type { PoolClient } from 'pg';
import { query } from '../config/database.js';
import type { CreateCustomerInput, CustomerQuery, UpdateCustomerInput } from '../models/customer.js';
import type { CreateFollowupInput } from '../models/customer.js';
import { getOffset } from '../utils/pagination.js';

export interface CustomerRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  business_name: string;
  gst_number: string | null;
  customer_type: string;
  address: string;
  status: string;
  follow_up_date: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export class CustomerRepository {
  async list(params: CustomerQuery) {
    const values: unknown[] = [];
    const where: string[] = [];

    if (params.search) {
      values.push(`%${params.search}%`);
      where.push(`(name ILIKE $${values.length} OR business_name ILIKE $${values.length} OR mobile ILIKE $${values.length})`);
    }

    if (params.status) {
      values.push(params.status);
      where.push(`status = $${values.length}`);
    }

    const offset = getOffset(params);
    values.push(params.limit, offset);

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await query<CustomerRecord>(
      `
        SELECT *
        FROM customers
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values
    );

    const countValues = values.slice(0, values.length - 2);
    const count = await query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM customers
        ${whereClause}
      `,
      countValues
    );

    return {
      rows: rows.rows,
      total: Number(count.rows[0]?.total ?? 0),
    };
  }

  async create(input: CreateCustomerInput, createdBy: string, client?: PoolClient) {
    const result = await (client
      ? client.query<CustomerRecord>(
          `
            INSERT INTO customers (
              name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
          `,
          [
            input.name,
            input.mobile,
            input.email,
            input.businessName,
            input.gstNumber || null,
            input.customerType,
            input.address,
            input.status,
            input.followUpDate ?? null,
            input.notes ?? null,
            createdBy,
          ]
        )
      : query<CustomerRecord>(
      `
        INSERT INTO customers (
          name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `,
      [
        input.name,
        input.mobile,
        input.email,
        input.businessName,
        input.gstNumber || null,
        input.customerType,
        input.address,
        input.status,
        input.followUpDate ?? null,
        input.notes ?? null,
        createdBy,
      ]
        ));

    return result.rows[0];
  }

  async findById(id: string, client?: PoolClient) {
    const result = await (client
      ? client.query<CustomerRecord>(`SELECT * FROM customers WHERE id = $1`, [id])
      : query<CustomerRecord>(`SELECT * FROM customers WHERE id = $1`, [id]));
    return result.rows[0] ?? null;
  }

  async update(id: string, input: UpdateCustomerInput, client?: PoolClient) {
    const fields = [
      ['name', input.name],
      ['mobile', input.mobile],
      ['email', input.email],
      ['business_name', input.businessName],
      ['gst_number', input.gstNumber === '' ? null : input.gstNumber],
      ['customer_type', input.customerType],
      ['address', input.address],
      ['status', input.status],
      ['follow_up_date', input.followUpDate],
      ['notes', input.notes],
    ].filter(([, value]) => value !== undefined);

    const setClause = fields.map(([field], index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(([, value]) => value ?? null)];

    const result = await (client
      ? client.query<CustomerRecord>(
          `
            UPDATE customers
            SET ${setClause}, updated_at = NOW()
            WHERE id = $1
            RETURNING *
          `,
          values
        )
      : query<CustomerRecord>(
      `
        UPDATE customers
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      values
        ));

    return result.rows[0] ?? null;
  }

  async addFollowup(customerId: string, createdBy: string, input: CreateFollowupInput, client: PoolClient) {
    const followup = await client.query(
      `
        INSERT INTO customer_followups (customer_id, note, follow_up_date, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [customerId, input.note, input.followUpDate ?? null, createdBy]
    );

    await client.query(
      `
        UPDATE customers
        SET follow_up_date = $2, status = COALESCE($3, status), updated_at = NOW()
        WHERE id = $1
      `,
      [customerId, input.followUpDate ?? null, input.status ?? null]
    );

    return followup.rows[0];
  }

  async listFollowups(customerId: string) {
    const result = await query(
      `
        SELECT cf.*, u.full_name AS created_by_name
        FROM customer_followups cf
        INNER JOIN users u ON u.id = cf.created_by
        WHERE cf.customer_id = $1
        ORDER BY cf.created_at DESC
      `,
      [customerId]
    );

    return result.rows;
  }
}
