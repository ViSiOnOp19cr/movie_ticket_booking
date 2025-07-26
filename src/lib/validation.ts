import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(30, 'Password must be at most 30 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .regex(/[\W_]/, 'Password must contain at least one special character');

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  email: z
    .string()
    .min(3, 'Email must be at least 3 characters')
    .trim(),
  password: passwordSchema
});

export const signinSchema = z.object({
  email: signupSchema.shape.email,
  password: signupSchema.shape.password
});
