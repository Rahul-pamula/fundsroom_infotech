import { withTransaction } from '../config/database.js';
import type { ChallanQuery, CreateChallanInput, UpdateDraftChallanInput } from '../models/challan.js';
import type { ChallanItemRecord } from '../repositories/challan.repository.js';
import { ChallanRepository } from '../repositories/challan.repository.js';
import { StockMovementRepository } from '../repositories/stock-movement.repository.js';
import { ConflictError, InsufficientStockError, NotFoundError } from '../utils/errors.js';

const challanRepository = new ChallanRepository();
const stockMovementRepository = new StockMovementRepository();
const sortByProductId = (left: ChallanItemRecord, right: ChallanItemRecord) =>
  left.product_id.localeCompare(right.product_id);

export class ChallanService {
  list(params: ChallanQuery) {
    return challanRepository.list(params);
  }

  async create(input: CreateChallanInput, createdBy: string) {
    return withTransaction(async (client) => {
      const challan = await challanRepository.create(input, createdBy, client);
      return challanRepository.detail(challan.id);
    });
  }

  async getById(id: string) {
    const detail = await challanRepository.detail(id);

    if (!detail.challan) {
      throw new NotFoundError('Challan not found');
    }

    return detail;
  }

  async updateDraft(id: string, input: UpdateDraftChallanInput) {
    return withTransaction(async (client) => {
      const challan = await challanRepository.findByIdForUpdate(id, client);

      if (!challan) {
        throw new NotFoundError('Challan not found');
      }

      if (challan.status !== 'DRAFT') {
        throw new ConflictError('Only DRAFT challans can be updated');
      }

      await challanRepository.replaceDraft(id, input, client);
      return challanRepository.detail(id);
    });
  }

  async confirm(id: string, confirmedBy: string) {
    return withTransaction(async (client) => {
      const challan = await challanRepository.findByIdForUpdate(id, client);

      if (!challan) {
        throw new NotFoundError('Challan not found');
      }

      if (challan.status !== 'DRAFT') {
        throw new ConflictError('Only DRAFT challans can be confirmed');
      }

      const items = await challanRepository.listItems(id, client);

      for (const item of items.sort(sortByProductId)) {
        const productResult = await client.query(
          `
            SELECT id, sku, current_stock
            FROM products
            WHERE id = $1
            FOR NO KEY UPDATE
          `,
          [item.product_id]
        );

        const product = productResult.rows[0];

        if (!product) {
          throw new NotFoundError('Product not found during challan confirmation');
        }

        if (product.current_stock < item.quantity) {
          throw new InsufficientStockError(
            `Requested quantity (${item.quantity}) exceeds available stock (${product.current_stock}) for ${product.sku}`
          );
        }
      }

      for (const item of items) {
        await client.query(
          `
            UPDATE products
            SET current_stock = current_stock - $1, updated_at = NOW()
            WHERE id = $2
          `,
          [item.quantity, item.product_id]
        );

        await stockMovementRepository.create(
          {
            productId: item.product_id,
            quantity: item.quantity,
            movementType: 'OUT',
            reason: 'Sales Challan Fulfillment',
            referenceType: 'CHALLAN',
            referenceId: id,
            createdBy: confirmedBy,
          },
          client
        );
      }

      await challanRepository.markConfirmed(id, confirmedBy, client);
      return challanRepository.detail(id);
    });
  }

  async cancel(id: string, cancelledBy: string) {
    return withTransaction(async (client) => {
      const challan = await challanRepository.findByIdForUpdate(id, client);

      if (!challan) {
        throw new NotFoundError('Challan not found');
      }

      if (challan.status === 'CANCELLED') {
        throw new ConflictError('Challan is already cancelled');
      }

      if (challan.status === 'CONFIRMED') {
        const items = await challanRepository.listItems(id, client);

        for (const item of items.sort(sortByProductId)) {
          await client.query(
            `
              SELECT id
              FROM products
              WHERE id = $1
              FOR NO KEY UPDATE
            `,
            [item.product_id]
          );
        }

        for (const item of items) {
          await client.query(
            `
              UPDATE products
              SET current_stock = current_stock + $1, updated_at = NOW()
              WHERE id = $2
            `,
            [item.quantity, item.product_id]
          );

          await stockMovementRepository.create(
            {
              productId: item.product_id,
              quantity: item.quantity,
              movementType: 'IN',
              reason: 'Sales Challan Cancellation Return',
              referenceType: 'CHALLAN',
              referenceId: id,
              createdBy: cancelledBy,
            },
            client
          );
        }
      }

      await challanRepository.markCancelled(id, client);
      return challanRepository.detail(id);
    });
  }
}
