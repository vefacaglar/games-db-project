import mongoose, { Schema, Document } from 'mongoose';
import { IGame } from '../../../domain/entities/IGame.js';

export interface GameDocument extends Omit<IGame, '_id' | 'createdBy' | 'updatedBy' | 'platforms'>, Document {
  platforms: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const GameSchema = new Schema<GameDocument>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200 },
    description: { type: String },
    genre: { type: String },
    platforms: [{ type: Schema.Types.ObjectId, ref: 'Platform' }],
    coverImage: { type: String },
    averageRating: { type: Number, default: 0, min: 0, max: 10 },
    totalRatings: { type: Number, default: 0 },
    mainTime: { type: Number, required: true, min: 0 },
    mainPlusExtraTime: { type: Number, required: true, min: 0 },
    completionistTime: { type: Number, required: true, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

GameSchema.index({ title: 'text' });
GameSchema.index({ genre: 1 });

export const GameModel = mongoose.model<GameDocument>('Game', GameSchema);