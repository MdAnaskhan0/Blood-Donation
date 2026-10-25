import { z } from 'zod';

export const PUBLIC_ROLES = ['donor', 'recipient', 'hospital', 'blood_bank', 'volunteer'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s-]{7,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  password,
  role: z.enum(PUBLIC_ROLES, { errorMap: () => ({ message: 'Choose a valid role' }) }),
  // Only used when role === 'donor'
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  city: z.string().trim().max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
});

export const resendSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});

export const forgotSchema = resendSchema;

export const resetSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
  password,
});
