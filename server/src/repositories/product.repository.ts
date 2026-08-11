import type { PoolClient } from 'pg';
import { query } from '../config/database.js';
import type { AdjustStockInput, CreateProductInput, ProductQuery, UpdateProductInput } from '../models/product.js';
import { getOffset } from '../utils/pagination.js';

export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit_price: string;
  current_stock: number;
  min_stock_alert: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export class ProductRepository {
  async list(params: ProductQuery) {
    const values: unknown[] = [];
    const where: string[] = [];

    if (params.search) {
      values.push(`%${params.search}%`);
      where.push(`(name ILIKE $${values.length} OR sku ILIKE $${values.length})`);
    }

    if (params.category) {
      values.push(params.category);
      where.push(`category = $${values.length}`);
    }

    if (params.lowStockOnly) {
      where.push('current_stock <= min_stock_alert');
    }

    const offset = getOffset(params);
    values.push(params.limit, offset);

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const rows = await query<ProductRecord>(
      `
        SELECT *
        FROM products
        ${whereClause}
        ORDER BY name ASC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values
    );

    const countValues = values.slice(0, values.length - 2);
    const count = await query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM products
        ${whereClause}
      `,
      countValues
    );

    return {
      rows: rows.rows,
      total: Number(count.rows[0]?.total ?? 0),
    };
  }

  async create(input: CreateProductInput, client?: PoolClient) {
    const result = await (client
      ? client.query<ProductRecord>(
          `
            INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
          `,
          [input.name, input.sku, input.category, input.unitPrice, input.currentStock, input.minStockAlert, input.location]
        )
      : query<ProductRecord>(
      `
        INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [input.name, input.sku, input.category, input.unitPrice, input.currentStock, input.minStockAlert, input.location]
        ));

    return result.rows[0];
  }

  async findById(id: string, client?: PoolClient) {
    const result = await (client
      ? client.query<ProductRecord>(`SELECT * FROM products WHERE id = $1`, [id])
      : query<ProductRecord>(`SELECT * FROM products WHERE id = $1`, [id]));
    return result.rows[0] ?? null;
  }

  async update(id: string, input: UpdateProductInput, client?: PoolClient) {
    const fields = [
      ['name', input.name],
      ['sku', input.sku],
      ['category', input.category],
      ['unit_price', input.unitPrice],
      ['current_stock', input.currentStock],
      ['min_stock_alert', input.minStockAlert],
      ['location', input.location],
    ].filter(([, value]) => value !== undefined);

    const setClause = fields.map(([field], index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(([, value]) => value)];

    const result = await (client
      ? client.query<ProductRecord>(
          `
            UPDATE products
            SET ${setClause}, updated_at = NOW()
            WHERE id = $1
            RETURNING *
          `,
          values
        )
      : query<ProductRecord>(
      `
        UPDATE products
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      values
        ));

    return result.rows[0] ?? null;
  }

  async adjustStock(id: string, input: AdjustStockInput, client: PoolClient) {
    const result = await client.query<ProductRecord>(
      `
        UPDATE products
        SET current_stock = CASE
          WHEN $2 = 'IN' THEN current_stock + $1
          ELSE current_stock - $1
        END,
        updated_at = NOW()
        WHERE id = $3
        AND (
          $2 = 'IN'
          OR current_stock >= $1
        )
        RETURNING *
      `,
      [input.quantity, input.movementType, id]
    );

    return result.rows[0] ?? null;
  }
}
