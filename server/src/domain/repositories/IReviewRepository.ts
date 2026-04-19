import { IReview, IReviewCreate, IReviewUpdate } from '../entities/IReview.js';

export interface IReviewRepository {
  findById(id: string): Promise<IReview | null>;
  findByGameId(gameId: string): Promise<IReview[]>;
  findByUserId(userId: string): Promise<IReview[]>;
  create(data: IReviewCreate): Promise<IReview>;
  update(id: string, data: IReviewUpdate): Promise<IReview | null>;
  delete(id: string): Promise<boolean>;
}