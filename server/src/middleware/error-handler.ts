import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError, InternalServerError, ValidationError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    const validationError = new ValidationError('Validation failed', error.issues);
    return response
      .status(validationError.statusCode)
      .json(errorResponse(validationError.code, validationError.message, validationError.details));
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json(errorResponse(error.code, error.message, error.details));
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  const internalError = new InternalServerError();
  return response
    .status(internalError.statusCode)
    .json(errorResponse(internalError.code, internalError.message));
};
