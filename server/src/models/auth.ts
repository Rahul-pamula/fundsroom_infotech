import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;
