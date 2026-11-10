import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const initDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI environment variable is missing.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(`✅ MongoDB Atlas Connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    return null;
  }
};

export default mongoose;
