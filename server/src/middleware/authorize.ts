import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../models/enums.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

export const authorize =
  (roles: UserRole[]) => (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new AuthenticationError());
    }

    if (!roles.includes(request.user.role)) {
      return next(new AuthorizationError('You do not have access to this resource'));
    }

    return next();
  };

