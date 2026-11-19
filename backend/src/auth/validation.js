import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .max(254, 'Email must be 254 characters or fewer.')
  .email('Enter a valid email address.')
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(72, 'Password must be 72 characters or fewer.')
  .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
    message: 'Password is too long.',
  });

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80, 'Name must be 80 characters or fewer.'),
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
