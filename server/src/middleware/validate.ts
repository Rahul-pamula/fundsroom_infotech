import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../utils/errors.js';

export const validateBody =
  <T extends ZodTypeAny>(schema: T) =>
  (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return next(new ValidationError('Request body validation failed', result.error.issues));
    }

    request.body = result.data;
    return next();
  };

export const validateQuery =
  <T extends ZodTypeAny>(schema: T) =>
  (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      return next(new ValidationError('Query validation failed', result.error.issues));
    }

    request.query = result.data;
    return next();
  };

