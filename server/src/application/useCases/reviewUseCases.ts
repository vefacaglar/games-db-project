import { ReviewService } from '../../domain/services/ReviewService.js';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository.js';
import { GameRepository } from '../../infrastructure/repositories/GameRepository.js';
import { CreateReviewDTO, UpdateReviewDTO } from '../dto/ReviewDTO.js';
import { IUser } from '../../domain/entities/IUser.js';

const reviewRepository = new ReviewRepository();
const gameRepository = new GameRepository();
const reviewService = new ReviewService(reviewRepository, gameRepository);

export async function getGameReviews(gameId: string) {
  return reviewService.findByGameId(gameId);
}

export async function getMyReviews(userId: string) {
  return reviewService.findByUserId(userId);
}

export async function createReview(data: CreateReviewDTO, user: IUser) {
  return reviewService.create({ ...data, user: user._id });
}

export async function updateReview(id: string, data: UpdateReviewDTO, user: IUser) {
  const review = await reviewService.update(id, data, user._id);
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
}

export async function deleteReview(id: string, user: IUser) {
  const result = await reviewService.delete(id, user._id, user.role);
  if (!result) {
    throw new Error('Review not found');
  }
  return { success: true };
}