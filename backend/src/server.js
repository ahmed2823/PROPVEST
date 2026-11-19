import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { getConfig } from './config.js';
import { User } from './models/User.js';

const config = getConfig();

try {
  await mongoose.connect(config.mongoUri);
  await User.init();

  const server = createApp(config).listen(config.port, '0.0.0.0', () => {
    console.log(`PropVest API listening on port ${config.port}`);
    console.log(`MongoDB connected; database: ${mongoose.connection.name}, collection: ${User.collection.collectionName}`);
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    });
  }
} catch (error) {
  console.error('Could not start the PropVest API. Check MongoDB and backend/.env:', error);
  process.exitCode = 1;
}
