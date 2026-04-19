import { IReviewRepository } from '../repositories/IReviewRepository.js';
import { IReviewCreate, IReviewUpdate } from '../entities/IReview.js';

export class ReviewService {
  constructor(private reviewRepository: IReviewRepository) {}

  async findById(id: string) {
    return this.reviewRepository.findById(id);
  }

  async findByGameId(gameId: string) {
    return this.reviewRepository.findByGameId(gameId);
  }

  async findByUserId(userId: string) {
    return this.reviewRepository.findByUserId(userId);
  }

  async create(data: IReviewCreate) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    return this.reviewRepository.create(data);
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

    return this.reviewRepository.update(id, data);
  }

  async delete(id: string, currentUserId: string, userRole: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user !== currentUserId && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    return this.reviewRepository.delete(id);
  }
}