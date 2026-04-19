import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../../../domain/entities/IReview.js';

export interface ReviewDocument extends Omit<IReview, '_id' | 'user' | 'game'>, Document {
  user: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

ReviewSchema.index({ game: 1 });
ReviewSchema.index({ user: 1 });

export const ReviewModel = mongoose.model<ReviewDocument>('Review', ReviewSchema);