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

  async calculateGameStats(gameId: string) {
    const reviews = await this.reviewRepository.findByGameId(gameId);
    if (reviews.length === 0) {
      await this.gameRepository.updateRating(gameId, 0, 0);
      await this.gameRepository.updateTimes(gameId, 0, 0, 0);
      return;
    }
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    await this.gameRepository.updateRating(gameId, averageRating, reviews.length);

    const mainTimes = reviews.filter(r => r.mainTime > 0).map(r => r.mainTime);
    const mainPlusExtraTimes = reviews.filter(r => r.mainPlusExtraTime && r.mainPlusExtraTime > 0).map(r => r.mainPlusExtraTime!);
    const completionistTimes = reviews.filter(r => r.completionistTime && r.completionistTime > 0).map(r => r.completionistTime!);

    const avgMain = mainTimes.length > 0 ? Math.round(mainTimes.reduce((a, b) => a + b, 0) / mainTimes.length) : 0;
    const avgMainPlus = mainPlusExtraTimes.length > 0 ? Math.round(mainPlusExtraTimes.reduce((a, b) => a + b, 0) / mainPlusExtraTimes.length) : 0;
    const avgCompl = completionistTimes.length > 0 ? Math.round(completionistTimes.reduce((a, b) => a + b, 0) / completionistTimes.length) : 0;

    await this.gameRepository.updateTimes(gameId, avgMain, avgMainPlus, avgCompl);
  }

  async create(data: IReviewCreate) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!data.mainTime || data.mainTime < 0) {
      throw new Error('Main time is required');
    }
    const review = await this.reviewRepository.create(data);
    await this.calculateGameStats(data.game);
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
    await this.calculateGameStats(review.game);
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
    await this.calculateGameStats(gameId);
    return result;
  }
}