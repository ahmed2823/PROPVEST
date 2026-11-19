import jwt from 'jsonwebtoken';

export function createAuthToken(userId, secret) {
  return jwt.sign({}, secret, {
    algorithm: 'HS256',
    subject: userId,
    expiresIn: '7d',
  });
}

export function verifyAuthToken(token, secret) {
  const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    throw new Error('Invalid authentication token.');
  }
  return payload.sub;
}
