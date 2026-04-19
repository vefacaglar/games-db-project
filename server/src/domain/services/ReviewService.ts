import { IReviewRepository } from '../repositories/IReviewRepository.js';
import { IReviewCreate, IReviewUpdate } from '../entities/IReview.js';
import { GameRepository } from '../../infrastructure/repositories/GameRepository.js';

export class ReviewService {
  constructor(
    private reviewRepository: IReviewRepository,
    private gameRepository: GameRepository
  ) {}

  async findById(id: string) {
    return this.reviewRepository.findById(id);
  }

  async findByGameId(gameId: string) {
    return this.reviewRepository.findByGameId(gameId);
  }

  async findByUserId(userId: string) {
    return this.reviewRepository.findByUserId(userId);
  }

  async calculateGameRating(gameId: string) {
    const reviews = await this.reviewRepository.findByGameId(gameId);
    if (reviews.length === 0) {
      await this.gameRepository.updateRating(gameId, 0, 0);
      return;
    }
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    await this.gameRepository.updateRating(gameId, averageRating, reviews.length);
  }

  async create(data: IReviewCreate) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!data.mainTime || data.mainTime < 0) {
      throw new Error('Main time is required');
    }
    const review = await this.reviewRepository.create(data);
    await this.calculateGameRating(data.game);
    return review;
  }

  async update(id: string, data: IReviewUpdate, currentUserId: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user !== currentUserId) {
      throw new Error('Unauthorized');
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updated = await this.reviewRepository.update(id, data);
    await this.calculateGameRating(review.game);
    return updated;
  }

  async delete(id: string, currentUserId: string, userRole: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user !== currentUserId && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    const gameId = review.game;
    const result = await this.reviewRepository.delete(id);
    await this.calculateGameRating(gameId);
    return result;
  }
}