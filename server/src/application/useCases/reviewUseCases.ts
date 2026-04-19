import { ReviewService } from '../../domain/services/ReviewService.js';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository.js';
import { UserLibraryRepository } from '../../infrastructure/repositories/UserLibraryRepository.js';
import { GameRepository } from '../../infrastructure/repositories/GameRepository.js';
import { CreateSubmissionDTO, UpdateSubmissionDTO } from '../dto/ReviewDTO.js';
import { IUser } from '../../domain/entities/IUser.js';
import { UserGameStatus } from '../../domain/entities/PlaytimeCategory.js';

import { PlaytimeCategory } from '../../domain/entities/PlaytimeCategory.js';

const reviewRepository = new ReviewRepository();
const gameRepository = new GameRepository();
const userLibraryRepository = new UserLibraryRepository();
const reviewService = new ReviewService(reviewRepository, gameRepository);

export async function getGameSubmissions(gameId: string) {
  return reviewService.findByGameId(gameId);
}

export async function getMySubmissions(userId: string) {
  return reviewService.findByUserId(userId);
}

export async function getPendingSubmissions() {
  return reviewService.findPending();
}

export async function createSubmission(data: CreateSubmissionDTO, user?: IUser) {
  return reviewService.create({ 
    gameId: data.game,
    category: data.category as PlaytimeCategory,
    platform: data.platform,
    hours: data.hours,
    notes: data.notes,
    userId: user?._id 
  });
}

export async function updateSubmission(id: string, data: UpdateSubmissionDTO, user: IUser) {
  const review = await reviewService.update(id, data, user._id);
  if (!review) {
    throw new Error('Submission not found');
  }
  return review;
}

export async function deleteSubmission(id: string, user: IUser) {
  const result = await reviewService.delete(id, user._id, user.role);
  if (!result) {
    throw new Error('Submission not found');
  }
  return { success: true };
}

export async function approveSubmission(id: string, admin: IUser) {
  if (admin.role !== 'admin') {
    throw new Error('Admin only');
  }
  const result = await reviewService.approve(id, admin._id);
  if (!result) {
    throw new Error('Submission not found');
  }
  return result;
}

export async function rejectSubmission(id: string, admin: IUser) {
  if (admin.role !== 'admin') {
    throw new Error('Admin only');
  }
  const result = await reviewService.reject(id, admin._id);
  if (!result) {
    throw new Error('Submission not found');
  }
  return result;
}

export async function getUserLibrary(userId: string) {
  return userLibraryRepository.findByUserId(userId);
}

export async function getUserLibraryByStatus(userId: string, status: string) {
  return userLibraryRepository.findByUserIdAndStatus(userId, status);
}

export async function addToLibrary(data: { user: string; game: string; status: string }) {
  return userLibraryRepository.create({
    user: data.user,
    game: data.game,
    status: data.status as UserGameStatus
  });
}

export async function updateLibraryEntry(id: string, data: any, userId: string) {
  const entry = await userLibraryRepository.update(id, data);
  if (!entry) {
    throw new Error('Library entry not found');
  }
  return entry;
}

export async function removeFromLibrary(userId: string, gameId: string) {
  const result = await userLibraryRepository.deleteByUserAndGame(userId, gameId);
  if (!result) {
    throw new Error('Library entry not found');
  }
  return { success: true };
}