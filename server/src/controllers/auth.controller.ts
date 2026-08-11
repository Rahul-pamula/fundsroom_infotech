import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { successResponse } from '../utils/response.js';

const authService = new AuthService();

export class AuthController {
  async login(request: Request, response: Response) {
    const { email, password, role } = request.body;
    const result = await authService.login(email, password, role);
    response.status(200).json(successResponse(result));
  }

  async signup(request: Request, response: Response) {
    const { email, password, name } = request.body;
    const result = await authService.signup(email, password, name);
    response.status(201).json(successResponse(result));
  }
}
