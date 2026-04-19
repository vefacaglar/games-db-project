import { rabbitMQService } from './infrastructure/messaging/RabbitMQService.js';
import { GameRepository } from './infrastructure/repositories/GameRepository.js';
import { ReviewRepository } from './infrastructure/repositories/ReviewRepository.js';
import { ReviewService } from './domain/services/ReviewService.js';
import { OutboxModel } from './infrastructure/database/schemas/OutboxSchema.js';

async function processOutbox() {
  try {
    const gameRepository = new GameRepository();
    const reviewRepository = new ReviewRepository();
    const reviewService = new ReviewService(reviewRepository, gameRepository);
    
    // Find unprocessed outbox records
    const outboxRecords = await OutboxModel.find({ processedAt: null }).limit(10).exec();
    
    for (const record of outboxRecords) {
      try {
        if (record.eventType === 'submission-created' || record.eventType === 'submission-deleted') {
          const gameId = (record.payload as any).gameId;
          console.log(`Processing outbox event for game: ${gameId}`);
          await reviewService.calculateGameStats(gameId);
          
          // Mark as processed
          record.processedAt = new Date();
          await record.save();
          console.log(`Outbox event processed for game: ${gameId}`);
        }
      } catch (error) {
        console.error(`Failed to process outbox record ${record._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing outbox:', error);
  }
}

export async function startConsumer() {
  try {
    // Connect to RabbitMQ
    await rabbitMQService.connect();
    
    // Initialize dependencies
    const gameRepository = new GameRepository();
    const reviewRepository = new ReviewRepository();
    const reviewService = new ReviewService(reviewRepository, gameRepository);
    
    // Consume messages from RabbitMQ
    await rabbitMQService.consume('game-stats-update', async (message) => {
      console.log('Received message from RabbitMQ:', message);
      
      const { gameId, type } = message;
      
      // Process all submission-related events
      if (type === 'submission-created' || type === 'submission-deleted' || type === 'submission-approved') {
        console.log(`Updating stats for game: ${gameId}`);
        await reviewService.calculateGameStats(gameId);
        console.log(`Stats updated for game: ${gameId}`);
      }
    });
    
    console.log('Game stats consumer started successfully');
    
  } catch (error) {
    console.error('Failed to start RabbitMQ consumer:', error);
    console.log('Continuing with outbox processor only...');
  }
  
  // Always start outbox processor regardless of RabbitMQ connection
  setInterval(processOutbox, 30000); // every 30 seconds
  processOutbox(); // initial run
}