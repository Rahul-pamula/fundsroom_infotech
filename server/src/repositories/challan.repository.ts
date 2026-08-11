import type { PoolClient } from 'pg';
import { query } from '../config/database.js';
import type { ChallanQuery, CreateChallanInput, UpdateDraftChallanInput } from '../models/challan.js';
import { getOffset } from '../utils/pagination.js';

export interface ChallanRecord {
  id: string;
  challan_number: string;
  customer_id: string;
  total_quantity: number;
  status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
  created_by: string;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChallanItemRecord {
  id: string;
  challan_id: string;
  product_id: string;
  quantity: number;
  snapshot_product_name: string;
  snapshot_sku: string;
  snapshot_unit_price: string;
}

export class ChallanRepository {
  async list(params: ChallanQuery) {
    const values: unknown[] = [];
    const where: string[] = [];

    if (params.search) {
      values.push(`%${params.search}%`);
      where.push(`c.challan_number ILIKE $${values.length}`);
    }

    if (params.status) {
      values.push(params.status);
      where.push(`c.status = $${values.length}`);
    }

    if (params.customerId) {
      values.push(params.customerId);
      where.push(`c.customer_id = $${values.length}`);
    }

    const offset = getOffset(params);
    values.push(params.limit, offset);

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const result = await query(
      `
        SELECT c.*, cu.business_name, u.full_name AS created_by_name
        FROM challans c
        INNER JOIN customers cu ON cu.id = c.customer_id
        INNER JOIN users u ON u.id = c.created_by
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values
    );

    const countValues = values.slice(0, values.length - 2);
    const count = await query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM challans c ${whereClause}`,
      countValues
    );

    return {
      rows: result.rows,
      total: Number(count.rows[0]?.total ?? 0),
    };
  }

  async generateChallanNumber(client: PoolClient) {
    const result = await client.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM challans
        WHERE date_trunc('month', created_at) = date_trunc('month', NOW())
      `
    );

    const sequence = String(Number(result.rows[0]?.count ?? 0) + 1).padStart(4, '0');
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `CH-${year}${month}-${sequence}`;
  }

  async create(input: CreateChallanInput, createdBy: string, client: PoolClient) {
    const challanNumber = await this.generateChallanNumber(client);
    const totalQuantity = input.items.reduce((sum, item) => sum + item.quantity, 0);

    const header = await client.query<ChallanRecord>(
      `
        INSERT INTO challans (challan_number, customer_id, total_quantity, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [challanNumber, input.customerId, totalQuantity, createdBy]
    );

    for (const item of input.items) {
      const product = await client.query(
        `
          SELECT id, name, sku, unit_price
          FROM products
          WHERE id = $1
        `,
        [item.productId]
      );

      const snapshot = product.rows[0];

      await client.query(
        `
          INSERT INTO challan_items (
            challan_id, product_id, quantity, snapshot_product_name, snapshot_sku, snapshot_unit_price
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          header.rows[0].id,
          item.productId,
          item.quantity,
          snapshot.name,
          snapshot.sku,
          snapshot.unit_price,
        ]
      );
    }

    return header.rows[0];
  }

  async findById(id: string, client?: PoolClient) {
    const result = await (client
      ? client.query<ChallanRecord>(`SELECT * FROM challans WHERE id = $1`, [id])
      : query<ChallanRecord>(`SELECT * FROM challans WHERE id = $1`, [id]));
    return result.rows[0] ?? null;
  }

  async findByIdForUpdate(id: string, client: PoolClient) {
    const result = await client.query<ChallanRecord>(
      `SELECT * FROM challans WHERE id = $1 FOR UPDATE`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  async listItems(challanId: string, client?: PoolClient) {
    const result = await (client
      ? client.query<ChallanItemRecord>(
          `
            SELECT *
            FROM challan_items
            WHERE challan_id = $1
            ORDER BY product_id ASC
          `,
          [challanId]
        )
      : query<ChallanItemRecord>(
      `
        SELECT *
        FROM challan_items
        WHERE challan_id = $1
        ORDER BY product_id ASC
      `,
      [challanId]
        ));

    return result.rows;
  }

  async replaceDraft(id: string, input: UpdateDraftChallanInput, client: PoolClient) {
    if (input.customerId) {
      await client.query(`UPDATE challans SET customer_id = $2, updated_at = NOW() WHERE id = $1`, [id, input.customerId]);
    }

    if (input.items) {
      await client.query(`DELETE FROM challan_items WHERE challan_id = $1`, [id]);

      for (const item of input.items) {
        const product = await client.query(
          `SELECT id, name, sku, unit_price FROM products WHERE id = $1`,
          [item.productId]
        );
        const snapshot = product.rows[0];

        await client.query(
          `
            INSERT INTO challan_items (
              challan_id, product_id, quantity, snapshot_product_name, snapshot_sku, snapshot_unit_price
            )
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [id, item.productId, item.quantity, snapshot.name, snapshot.sku, snapshot.unit_price]
        );
      }

      const totalQuantity = input.items.reduce((sum, item) => sum + item.quantity, 0);
      await client.query(`UPDATE challans SET total_quantity = $2, updated_at = NOW() WHERE id = $1`, [id, totalQuantity]);
    }
  }

  async markConfirmed(id: string, confirmedBy: string, client: PoolClient) {
    const result = await client.query<ChallanRecord>(
      `
        UPDATE challans
        SET status = 'CONFIRMED', confirmed_by = $2, confirmed_at = NOW(), updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [id, confirmedBy]
    );

    return result.rows[0];
  }

  async markCancelled(id: string, client: PoolClient) {
    const result = await client.query<ChallanRecord>(
      `
        UPDATE challans
        SET status = 'CANCELLED', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }

  async detail(id: string) {
    const header = await query(
      `
        SELECT c.*, cu.name AS customer_name, cu.business_name, cu.mobile, cu.email
        FROM challans c
        INNER JOIN customers cu ON cu.id = c.customer_id
        WHERE c.id = $1
      `,
      [id]
    );

    const items = await this.listItems(id);
    return {
      challan: header.rows[0] ?? null,
      items,
    };
  }
}
