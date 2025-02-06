import mongoose, { Connection } from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

mongoose.set('strictQuery', false);

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Global cache to avoid multiple connections
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function connectToDatabase(): Promise<Connection> {
  if (typeof window !== 'undefined') {
    throw new Error('Database connection should only be initiated on the server side.');
  }

  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose.connection);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }

  return global.mongoose.conn;
}

export default connectToDatabase;
