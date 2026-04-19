import { IReviewRepository } from '../repositories/IReviewRepository.js';
import { IPlaytimeSubmissionCreate, IPlaytimeSubmissionUpdate } from '../entities/IReview.js';
import { GameRepository } from '../../infrastructure/repositories/GameRepository.js';
import { PlaytimeCategory } from '../entities/PlaytimeCategory.js';
import { PlaytimeEstimate, calculateConfidence, calculateMedian, calculateAverage } from '../entities/PlaytimeEstimate.js';

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

  async findPending() {
    return this.reviewRepository.findPending();
  }

  async findByUserId(userId: string) {
    return this.reviewRepository.findByUserId(userId);
  }

  async calculateGameStats(gameId: string) {
    const submissions = await this.reviewRepository.findByGameIdForStats(gameId);
    
    if (submissions.length === 0) {
      await this.gameRepository.updateRating(gameId, 0, 0);
      await this.gameRepository.updateTimes(gameId, 0, 0, 0);
      return;
    }

    const mainStory = submissions.filter(s => s.category === PlaytimeCategory.MainStory);
    const mainPlusSides = submissions.filter(s => s.category === PlaytimeCategory.MainPlusSides);
    const completionist = submissions.filter(s => s.category === PlaytimeCategory.Completionist);

    const calculateEstimate = (subs: typeof submissions): PlaytimeEstimate | undefined => {
      if (subs.length === 0) return undefined;
      const hours = subs.map(s => s.hours);
      return {
        category: subs[0].category,
        averageHours: calculateAverage(hours),
        medianHours: calculateMedian(hours),
        minHours: Math.min(...hours),
        maxHours: Math.max(...hours),
        submissionCount: subs.length,
        confidence: calculateConfidence(subs.length)
      };
    };

    const estimateMain = calculateEstimate(mainStory);
    const estimateMainPlus = calculateEstimate(mainPlusSides);
    const estimateCompl = calculateEstimate(completionist);

    const totalApproved = mainStory.length + mainPlusSides.length + completionist.length;
    const avgRating = totalApproved > 0 ? totalApproved / 3 : 0;

    await this.gameRepository.updateRating(gameId, avgRating, totalApproved);
    await this.gameRepository.updateTimes(
      gameId,
      estimateMain?.averageHours || 0,
      estimateMainPlus?.averageHours || 0,
      estimateCompl?.averageHours || 0
    );
  }

  async create(data: IPlaytimeSubmissionCreate) {
    if (!data.hours || data.hours <= 0) {
      throw new Error('Hours must be greater than 0');
    }
    if (!data.category) {
      throw new Error('Category is required');
    }

    const submission = await this.reviewRepository.create(data);
    
    // Outbox pattern: create outbox record for reliable messaging
    const { OutboxModel } = await import('../../infrastructure/database/schemas/OutboxSchema.js');
    await OutboxModel.create({
      eventType: 'submission-created',
      payload: {
        gameId: submission.gameId,
        submissionId: submission._id,
        hours: submission.hours,
        category: submission.category,
        libraryStatus: data.libraryStatus,
      },
      createdAt: new Date()
    });
    
    // Also publish to RabbitMQ (best effort)
    try {
      const { rabbitMQService } = await import('../../infrastructure/messaging/RabbitMQService.js');
      await rabbitMQService.publish('game-stats-update', {
        gameId: submission.gameId,
        type: 'submission-created',
        submissionId: submission._id,
      });
    } catch (error) {
      console.error('Failed to publish to RabbitMQ, but outbox record saved:', error);
    }
    
    return submission;
  }

  async approve(id: string, adminUserId: string) {
    // No longer needed as submissions are auto-approved
    // But keep the method for backward compatibility
    const submission = await this.reviewRepository.approve(id, adminUserId);
    return submission;
  }

  async reject(id: string, adminUserId: string) {
    const submission = await this.reviewRepository.reject(id, adminUserId);
    if (submission) {
      // If a submission is rejected, recalculate stats
      const { rabbitMQService } = await import('../../infrastructure/messaging/RabbitMQService.js');
      await rabbitMQService.publish('game-stats-update', {
        gameId: submission.gameId,
        type: 'submission-deleted', // treat as deletion
        submissionId: submission._id,
      });
    }
    return submission;
  }

  async update(id: string, data: IPlaytimeSubmissionUpdate, currentUserId: string) {
    const submission = await this.reviewRepository.findById(id);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.userId !== currentUserId) {
      throw new Error('Unauthorized');
    }

    if (submission.status !== 'pending') {
      throw new Error('Can only update pending submissions');
    }

    const updated = await this.reviewRepository.update(id, data);
    return updated;
  }

  async delete(id: string, currentUserId: string, userRole: string) {
    const submission = await this.reviewRepository.findById(id);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.userId !== currentUserId && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    const gameId = submission.gameId;
    const result = await this.reviewRepository.delete(id);
    // Publish event to RabbitMQ
    const { rabbitMQService } = await import('../../infrastructure/messaging/RabbitMQService.js');
    await rabbitMQService.publish('game-stats-update', {
      gameId,
      type: 'submission-deleted',
      submissionId: id,
    });
    return result;
  }
}