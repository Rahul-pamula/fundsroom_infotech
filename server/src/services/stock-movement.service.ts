import { StockMovementRepository } from '../repositories/stock-movement.repository.js';

const stockMovementRepository = new StockMovementRepository();

export class StockMovementService {
  list() {
    return stockMovementRepository.list();
  }
}

