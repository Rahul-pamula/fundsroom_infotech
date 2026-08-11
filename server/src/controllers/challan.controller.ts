import type { Request, Response } from 'express';
import { ChallanService } from '../services/challan.service.js';
import { successResponse } from '../utils/response.js';

const challanService = new ChallanService();

export class ChallanController {
  async list(request: Request, response: Response) {
    const result = await challanService.list(request.query as never);
    response.status(200).json(
      successResponse(result.rows, {
        page: Number(request.query.page),
        limit: Number(request.query.limit),
        total: result.total,
      })
    );
  }

  async create(request: Request, response: Response) {
    const result = await challanService.create(request.body, request.user!.id);
    response.status(201).json(successResponse(result));
  }

  async getById(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await challanService.getById(id);
    response.status(200).json(successResponse(result));
  }

  async updateDraft(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await challanService.updateDraft(id, request.body);
    response.status(200).json(successResponse(result));
  }

  async confirm(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await challanService.confirm(id, request.user!.id);
    response.status(200).json(successResponse(result));
  }

  async cancel(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const result = await challanService.cancel(id, request.user!.id);
    response.status(200).json(successResponse(result));
  }
}
