import type { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = (request: Request, _response: Response, next: NextFunction) => {
  const header = request.header('Authorization');

  if (!header?.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing Bearer token'));
  }

  try {
    const token = header.slice('Bearer '.length);
    const payload = verifyToken(token);

    request.user = {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
    };

    return next();
  } catch {
    return next(new AuthenticationError('Invalid or expired token'));
  }
};

