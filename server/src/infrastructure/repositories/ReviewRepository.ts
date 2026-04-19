import { IReviewRepository } from '../../domain/repositories/IReviewRepository.js';
import { IReview, IReviewCreate, IReviewUpdate } from '../../domain/entities/IReview.js';
import { ReviewModel, ReviewDocument } from '../database/schemas/ReviewSchema.js';
import mongoose from 'mongoose';

export class ReviewRepository implements IReviewRepository {
  private mapToEntity(doc: ReviewDocument): IReview {
    return {
      _id: doc._id.toString(),
      user: doc.user.toString(),
      game: doc.game.toString(),
      rating: doc.rating,
      mainTime: doc.mainTime,
      mainPlusExtraTime: doc.mainPlusExtraTime,
      completionistTime: doc.completionistTime,
      comment: doc.comment,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IReview | null> {
    const doc = await ReviewModel.findById(id).populate('user', 'username').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByGameId(gameId: string): Promise<IReview[]> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const docs = await ReviewModel.find({ game: objectId }).populate('user', 'username').exec();
    return docs.map(this.mapToEntity);
  }

  async findByUserId(userId: string): Promise<IReview[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const docs = await ReviewModel.find({ user: objectId }).populate('game', 'title').exec();
    return docs.map(this.mapToEntity);
  }

  async create(data: IReviewCreate): Promise<IReview> {
    const doc = await ReviewModel.create({
      user: new mongoose.Types.ObjectId(data.user),
      game: new mongoose.Types.ObjectId(data.game),
      rating: data.rating,
      mainTime: data.mainTime,
      mainPlusExtraTime: data.mainPlusExtraTime || 0,
      completionistTime: data.completionistTime || 0,
      comment: data.comment
    });
    const populated = await ReviewModel.findById(doc._id).populate('user', 'username').exec();
    return this.mapToEntity(populated!);
  }

  async update(id: string, data: IReviewUpdate): Promise<IReview | null> {
    const doc = await ReviewModel.findByIdAndUpdate(id, data, { new: true })
      .populate('user', 'username')
      .exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ReviewModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}