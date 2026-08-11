import type { Request, Response } from 'express';
import { errorResponse } from '../utils/response.js';

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json(errorResponse('NOT_FOUND', 'Route not found'));
};

