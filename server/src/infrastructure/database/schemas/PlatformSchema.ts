import mongoose, { Schema, Document } from 'mongoose';
import { IPlatform } from '../../../domain/entities/IPlatform.js';

export interface PlatformDocument extends Omit<IPlatform, '_id'>, Document {}

const PlatformSchema = new Schema<PlatformDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true }
  },
  { timestamps: true }
);

export const PlatformModel = mongoose.model<PlatformDocument>('Platform', PlatformSchema);