import type { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

const dashboardService = new DashboardService();

export class DashboardController {
  async summary(_request: Request, response: Response) {
    const result = await dashboardService.getSummary();
    response.status(200).json(successResponse(result));
  }
}

