import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

let isConnected = false;

export const initDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return true;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

export default mongoose;
