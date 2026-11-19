import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createAuthRouter } from './auth/routes.js';

export function createApp({ jwtSecret, corsOrigins }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      const error = new Error('This origin is not allowed by CORS.');
      error.code = 'CORS_NOT_ALLOWED';
      return callback(error);
    },
  }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many authentication attempts. Try again later.' },
    }),
    createAuthRouter({ jwtSecret }),
  );

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });

  app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body is too large.' });
    }
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    if (error?.code === 'CORS_NOT_ALLOWED') {
      return res.status(403).json({ error: 'This origin is not allowed.' });
    }
    console.error('API request failed:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  });

  return app;
}
