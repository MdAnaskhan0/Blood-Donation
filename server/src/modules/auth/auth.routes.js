import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import * as c from './auth.controller.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendSchema,
  forgotSchema,
  resetSchema,
} from './auth.schema.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), c.register);
router.post('/login', authLimiter, validate(loginSchema), c.login);
router.post('/verify-email', validate(verifyEmailSchema), c.verifyEmail);
router.post('/resend-verification', authLimiter, validate(resendSchema), c.resendVerification);
router.post('/forgot-password', authLimiter, validate(forgotSchema), c.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetSchema), c.resetPassword);
router.get('/me', authenticate, c.me);

export default router;
