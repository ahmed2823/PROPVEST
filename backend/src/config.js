export function getConfig(env = process.env) {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 bytes.');
  }

  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
  }

  return {
    port,
    mongoUri: env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/propvest',
    jwtSecret,
    corsOrigins: (env.CORS_ORIGIN ?? 'http://localhost:8081,http://localhost:19006')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
}
