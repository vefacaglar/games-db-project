import mongoose, { Schema, Document } from 'mongoose';
import { IPlaytimeSubmission } from '../../../domain/entities/IReview.js';
import { PlaytimeCategory, PlaytimeSubmissionStatus } from '../../../domain/entities/PlaytimeCategory.js';

export interface ReviewDocument extends Omit<IPlaytimeSubmission, '_id' | 'gameId' | 'userId' | 'reviewedBy'>, Document {
  gameId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, enum: Object.values(PlaytimeCategory), required: true },
    platform: { type: String },
    storefront: { type: String },
    hours: { type: Number, required: true, min: 0.1 },
    notes: { type: String },
    status: { type: String, enum: Object.values(PlaytimeSubmissionStatus), default: PlaytimeSubmissionStatus.Pending },
    // New fields
    progressHours: { type: Number, default: 0 },
    progressMinutes: { type: Number, default: 0 },
    progressSeconds: { type: Number, default: 0 },
    startDate: { type: Date },
    completionDate: { type: Date },
    libraryStatus: [{ type: String }],
    singlePlayerNotes: {
      mainStory: { type: String },
      main_plus_sides: { type: String },
      completionist: { type: String }
    },
    speedrunNotes: { type: String },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ReviewSchema.index({ gameId: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ gameId: 1, status: 1, category: 1 });
ReviewSchema.index({ userId: 1 });

export const ReviewModel = mongoose.model<ReviewDocument>('Review', ReviewSchema);