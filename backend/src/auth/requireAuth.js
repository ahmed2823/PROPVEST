import { verifyAuthToken } from './token.js';
import { User } from '../models/User.js';

export function requireAuth({ jwtSecret }) {
  return async (req, res, next) => {
    const authorization = req.get('authorization') ?? '';
    const match = /^Bearer ([^\s]+)$/i.exec(authorization);
    if (!match) {
      return res.status(401).json({ error: 'Sign in to continue.' });
    }

    let userId;
    try {
      userId = verifyAuthToken(match[1], jwtSecret);
    } catch {
      return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ error: 'Your account is no longer available. Please sign in again.' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
