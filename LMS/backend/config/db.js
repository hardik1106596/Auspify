import mongoose from 'mongoose';

export default async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required.');
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
