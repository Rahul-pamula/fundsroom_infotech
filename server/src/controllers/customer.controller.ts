import type { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service.js';
import { successResponse } from '../utils/response.js';

const customerService = new CustomerService();

export class CustomerController {
  async list(request: Request, response: Response) {
    const result = await customerService.list(request.query as never);
    response.status(200).json(
      successResponse(result.rows, {
        page: Number(request.query.page),
        limit: Number(request.query.limit),
        total: result.total,
      })
    );
  }

  async create(request: Request, response: Response) {
    const result = await customerService.create(request.body, request.user!.id);
    response.status(201).json(successResponse(result));
  }

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await customerService.getById(id);
    response.status(200).json(successResponse(result));
  }

  async update(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await customerService.update(id, request.body);
    response.status(200).json(successResponse(result));
  }

  async addFollowup(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await customerService.addFollowup(id, request.user!.id, request.body);
    response.status(201).json(successResponse(result));
  }
}
