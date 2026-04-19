import { rabbitMQService } from './infrastructure/messaging/RabbitMQService.js';
import { GameRepository } from './infrastructure/repositories/GameRepository.js';
import { ReviewRepository } from './infrastructure/repositories/ReviewRepository.js';
import { ReviewService } from './domain/services/ReviewService.js';

async function startConsumer() {
  try {
    // Connect to RabbitMQ
    await rabbitMQService.connect();
    
    // Initialize dependencies
    const gameRepository = new GameRepository();
    const reviewRepository = new ReviewRepository();
    const reviewService = new ReviewService(reviewRepository, gameRepository);
    
    // Consume messages
    await rabbitMQService.consume('game-stats-update', async (message) => {
      console.log('Received message:', message);
      
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
    console.error('Failed to start consumer:', error);
    process.exit(1);
  }
}

// Start consumer if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startConsumer();
}

export { startConsumer };