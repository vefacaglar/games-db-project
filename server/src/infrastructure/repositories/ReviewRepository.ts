import { IReviewRepository } from '../../domain/repositories/IReviewRepository.js';
import { IPlaytimeSubmission, IPlaytimeSubmissionCreate, IPlaytimeSubmissionUpdate } from '../../domain/entities/IReview.js';
import { PlaytimeCategory, PlaytimeSubmissionStatus } from '../../domain/entities/PlaytimeCategory.js';
import { ReviewModel, ReviewDocument } from '../database/schemas/ReviewSchema.js';
import mongoose from 'mongoose';

export class ReviewRepository implements IReviewRepository {
  private mapToEntity(doc: ReviewDocument): IPlaytimeSubmission {
    return {
      _id: doc._id.toString(),
      gameId: doc.gameId.toString(),
      userId: doc.userId?.toString(),
      category: doc.category as PlaytimeCategory,
      platform: doc.platform,
      hours: doc.hours,
      notes: doc.notes,
      status: doc.status as PlaytimeSubmissionStatus,
      createdAt: doc.createdAt,
      reviewedAt: doc.reviewedAt,
      reviewedBy: doc.reviewedBy?.toString()
    };
  }

  async findById(id: string): Promise<IPlaytimeSubmission | null> {
    const doc = await ReviewModel.findById(id).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByGameIdForStats(gameId: string): Promise<IPlaytimeSubmission[]> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const docs = await ReviewModel.find({ 
      gameId: objectId, 
      status: PlaytimeSubmissionStatus.Approved 
    }).exec();
    return docs.map(this.mapToEntity);
  }

  async findByGameId(gameId: string): Promise<IPlaytimeSubmission[]> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const docs = await ReviewModel.find({ gameId: objectId }).exec();
    return docs.map(this.mapToEntity);
  }

  async findPending(): Promise<IPlaytimeSubmission[]> {
    const docs = await ReviewModel.find({ status: PlaytimeSubmissionStatus.Pending })
      .populate('gameId', 'title')
      .exec();
    return docs.map(this.mapToEntity);
  }

  async findByUserId(userId: string): Promise<IPlaytimeSubmission[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const docs = await ReviewModel.find({ userId: objectId }).populate('gameId', 'title').exec();
    return docs.map(this.mapToEntity);
  }

  async create(data: IPlaytimeSubmissionCreate): Promise<IPlaytimeSubmission> {
    const doc = await ReviewModel.create({
      gameId: new mongoose.Types.ObjectId(data.gameId),
      userId: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
      category: data.category,
      platform: data.platform,
      hours: data.hours,
      notes: data.notes,
      status: PlaytimeSubmissionStatus.Approved // Auto-approve submissions
    });
    return this.mapToEntity(doc);
  }

  async update(id: string, data: IPlaytimeSubmissionUpdate): Promise<IPlaytimeSubmission | null> {
    const doc = await ReviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async approve(id: string, adminUserId: string): Promise<IPlaytimeSubmission | null> {
    const doc = await ReviewModel.findByIdAndUpdate(
      id,
      { 
        status: PlaytimeSubmissionStatus.Approved,
        reviewedAt: new Date(),
        reviewedBy: new mongoose.Types.ObjectId(adminUserId)
      },
      { new: true }
    ).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async reject(id: string, adminUserId: string): Promise<IPlaytimeSubmission | null> {
    const doc = await ReviewModel.findByIdAndUpdate(
      id,
      { 
        status: PlaytimeSubmissionStatus.Rejected,
        reviewedAt: new Date(),
        reviewedBy: new mongoose.Types.ObjectId(adminUserId)
      },
      { new: true }
    ).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ReviewModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}