import type { Request, Response } from 'express';
import { StockMovementService } from '../services/stock-movement.service.js';
import { successResponse } from '../utils/response.js';

const stockMovementService = new StockMovementService();

export class StockMovementController {
  async list(_request: Request, response: Response) {
    const result = await stockMovementService.list();
    response.status(200).json(successResponse(result));
  }
}

