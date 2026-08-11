import type { PoolClient } from 'pg';
import { query } from '../config/database.js';
import type { MovementReferenceType, MovementType } from '../models/enums.js';

export interface StockMovementRecord {
  id: string;
  product_id: string;
  quantity: number;
  movement_type: MovementType;
  reason: string;
  reference_type: MovementReferenceType;
  reference_id: string | null;
  created_by: string;
  created_at: string;
}

export class StockMovementRepository {
  async create(
    movement: {
      productId: string;
      quantity: number;
      movementType: MovementType;
      reason: string;
      referenceType: MovementReferenceType;
      referenceId?: string | null;
      createdBy: string;
    },
    client: PoolClient
  ) {
    const result = await client.query<StockMovementRecord>(
      `
        INSERT INTO stock_movements (
          product_id, quantity, movement_type, reason, reference_type, reference_id, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        movement.productId,
        movement.quantity,
        movement.movementType,
        movement.reason,
        movement.referenceType,
        movement.referenceId ?? null,
        movement.createdBy,
      ]
    );

    return result.rows[0];
  }

  async list() {
    const result = await query(
      `
        SELECT sm.*, p.name AS product_name, p.sku, u.full_name AS created_by_name
        FROM stock_movements sm
        INNER JOIN products p ON p.id = sm.product_id
        INNER JOIN users u ON u.id = sm.created_by
        ORDER BY sm.created_at DESC
      `
    );

    return result.rows;
  }
}

