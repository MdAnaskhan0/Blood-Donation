import { z } from 'zod';

export const ROLES = [
  { value: 'donor', label: 'Donor' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'blood_bank', label: 'Blood Bank' },
  { value: 'volunteer', label: 'Volunteer' },
];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const email = z.string().trim().toLowerCase().email('Enter a valid email');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email,
    phone: z
      .string()
      .trim()
      .refine((v) => v === '' || /^[+]?[0-9\s-]{7,20}$/.test(v), 'Enter a valid phone number')
      .optional(),
    role: z.enum(['donor', 'recipient', 'hospital', 'blood_bank', 'volunteer'], {
      message: 'Choose a role',
    }),
    bloodGroup: z.string().optional(),
    city: z.string().trim().optional(),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((d) => d.role !== 'donor' || BLOOD_GROUPS.includes(d.bloodGroup), {
    path: ['bloodGroup'],
    message: 'Select your blood group',
  });

export const forgotSchema = z.object({ email });

export const resetSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
