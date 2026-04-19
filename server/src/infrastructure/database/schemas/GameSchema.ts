import mongoose, { Schema, Document } from 'mongoose';
import { IGame } from '../../../domain/entities/IGame.js';

export interface GameDocument extends Omit<IGame, '_id' | 'createdBy' | 'updatedBy'>, Document {
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const GameSchema = new Schema<GameDocument>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200 },
    description: { type: String },
    genre: { type: String },
    platform: [{ type: String }],
    playTime: { type: Number, required: true, min: 0 },
    coverImage: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

GameSchema.index({ title: 'text' });
GameSchema.index({ genre: 1 });
GameSchema.index({ platform: 1 });

export const GameModel = mongoose.model<GameDocument>('Game', GameSchema);