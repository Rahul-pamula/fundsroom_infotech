/* eslint-disable @typescript-eslint/no-namespace */
import type { UserRole } from '../models/enums.js';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
