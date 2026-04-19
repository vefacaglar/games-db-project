import { IPlaytimeSubmission, IPlaytimeSubmissionCreate, IPlaytimeSubmissionUpdate } from '../entities/IReview.js';

export interface IReviewRepository {
  findById(id: string): Promise<IPlaytimeSubmission | null>;
  findByGameId(gameId: string): Promise<IPlaytimeSubmission[]>;
  findByGameIdForStats(gameId: string): Promise<IPlaytimeSubmission[]>;
  findPending(): Promise<IPlaytimeSubmission[]>;
  findByUserId(userId: string): Promise<IPlaytimeSubmission[]>;
  create(data: IPlaytimeSubmissionCreate): Promise<IPlaytimeSubmission>;
  update(id: string, data: IPlaytimeSubmissionUpdate): Promise<IPlaytimeSubmission | null>;
  approve(id: string, adminUserId: string): Promise<IPlaytimeSubmission | null>;
  reject(id: string, adminUserId: string): Promise<IPlaytimeSubmission | null>;
  delete(id: string): Promise<boolean>;
}