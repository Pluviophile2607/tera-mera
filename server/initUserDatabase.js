import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'tera_mera';

if (!mongoUri) {
  throw new Error('MONGODB_URI is not configured.');
}

try {
  await mongoose.connect(mongoUri, { dbName });
  await User.createCollection().catch((error) => {
    if (error?.codeName !== 'NamespaceExists') {
      throw error;
    }
  });
  await User.init();
  console.log(`Initialized "${dbName}" database with "users" collection.`);
} finally {
  await mongoose.disconnect();
}
