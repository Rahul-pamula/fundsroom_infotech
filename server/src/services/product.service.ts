import { withTransaction } from '../config/database.js';
import type { AdjustStockInput, CreateProductInput, ProductQuery, UpdateProductInput } from '../models/product.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { StockMovementRepository } from '../repositories/stock-movement.repository.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

const productRepository = new ProductRepository();
const stockMovementRepository = new StockMovementRepository();

export class ProductService {
  list(params: ProductQuery) {
    return productRepository.list(params);
  }

  create(input: CreateProductInput) {
    return productRepository.create(input);
  }

  async update(id: string, input: UpdateProductInput) {
    const product = await productRepository.update(id, input);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  async adjustStock(id: string, input: AdjustStockInput, createdBy: string) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    return withTransaction(async (client) => {
      const updated = await productRepository.adjustStock(id, input, client);

      if (!updated) {
        throw new ConflictError('Insufficient stock for OUT adjustment');
      }

      await stockMovementRepository.create(
        {
          productId: id,
          quantity: input.quantity,
          movementType: input.movementType,
          reason: input.reason,
          referenceType: 'MANUAL_ADJUSTMENT',
          createdBy,
        },
        client
      );

      return updated;
    });
  }
}

