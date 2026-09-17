import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google's Public DNS to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const globalForMongo = globalThis as unknown as {
  mongoosePromise?: Promise<typeof mongoose> | null;
};

export function getMongoUri(): string {
  const uri =
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URL ||
    '';

  if (!uri || uri.startsWith('file:')) {
    throw new Error(
      'Missing MongoDB URI. Set MONGODB_URI in .env.local (mongodb+srv://...).'
    );
  }

  return uri.trim().replace(/^["']|["']$/g, '');
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalForMongo.mongoosePromise) {
    globalForMongo.mongoosePromise = mongoose
      .connect(getMongoUri(), {
        dbName: process.env.MONGODB_DB || 'dangedrive',
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      })
      .catch((error) => {
        // Clear cached promise so the next request can retry
        globalForMongo.mongoosePromise = null;
        throw error;
      });
  }

  return globalForMongo.mongoosePromise;
}