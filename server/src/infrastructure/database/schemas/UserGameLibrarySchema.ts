import mongoose, { Schema, Document } from 'mongoose';
import { IUserGameLibrary } from '../../../domain/entities/UserGameStatus.js';
import { UserGameStatus } from '../../../domain/entities/PlaytimeCategory.js';

export interface UserGameLibraryDocument extends Omit<IUserGameLibrary, '_id' | 'user' | 'game'>, Document {
  user: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
}

const UserGameLibrarySchema = new Schema<UserGameLibraryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    status: { type: String, enum: Object.values(UserGameStatus), required: true },
    personalRating: { type: Number, min: 1, max: 10 },
    personalNotes: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

UserGameLibrarySchema.index({ user: 1, game: 1 }, { unique: true });
UserGameLibrarySchema.index({ user: 1 });
UserGameLibrarySchema.index({ user: 1, status: 1 });

export const UserGameLibraryModel = mongoose.model<UserGameLibraryDocument>('UserGameLibrary', UserGameLibrarySchema);