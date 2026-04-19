import mongoose from 'mongoose';
import { config } from '../config/index.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}