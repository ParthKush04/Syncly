import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment.');
  }
  else{
    console.log("MongoDb Connected")
  }

  // Use the official connection defaults that work well for production.
  return mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production'
  });
}
