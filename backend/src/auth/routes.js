import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { signinSchema, signupSchema } from './validation.js';
import { createAuthToken } from './token.js';
import { serializeUser, User } from '../models/User.js';
import { requireAuth } from './requireAuth.js';

function validationError(result) {
  return result.error.issues[0]?.message ?? 'Please check the submitted details.';
}

export function createAuthRouter({ jwtSecret }) {
  const router = Router();

  router.post('/signup', async (req, res, next) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: validationError(result) });
    }

    try {
      const { name, email, password } = result.data;
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email, passwordHash });
      return res.status(201).json({
        token: createAuthToken(user._id.toString(), jwtSecret),
        user: serializeUser(user),
      });
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      return next(error);
    }
  });

  router.post('/signin', async (req, res, next) => {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: validationError(result) });
    }

    try {
      const { email, password } = result.data;
      const user = await User.findOne({ email }).select('+passwordHash');
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Email or password is incorrect.' });
      }
      return res.json({
        token: createAuthToken(user._id.toString(), jwtSecret),
        user: serializeUser(user),
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/me', requireAuth({ jwtSecret }), (req, res) => {
    res.json({ user: serializeUser(req.user) });
  });

  return router;
}
