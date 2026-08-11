export type UserRole = 'ADMIN' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTS';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
