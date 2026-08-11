import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { successResponse } from '../utils/response.js';

const productService = new ProductService();

export class ProductController {
  async list(request: Request, response: Response) {
    const result = await productService.list(request.query as never);
    response.status(200).json(
      successResponse(result.rows, {
        page: Number(request.query.page),
        limit: Number(request.query.limit),
        total: result.total,
      })
    );
  }

  async create(request: Request, response: Response) {
    const result = await productService.create(request.body);
    response.status(201).json(successResponse(result));
  }

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await productService.update(id, request.body);
    response.status(200).json(successResponse(result));
  }

  async adjustStock(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await productService.adjustStock(id, request.body, request.user!.id);
    response.status(200).json(successResponse(result));
  }
}
