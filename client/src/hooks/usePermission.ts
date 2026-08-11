import type { UserRole } from '../types/auth';
import { useAuth } from './useAuth';

export const usePermission = (roles: UserRole[]) => {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
};

