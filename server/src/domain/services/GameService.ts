import { IGameRepository, GameFilters } from '../repositories/IGameRepository.js';
import { IGameCreate, IGameUpdate } from '../entities/IGame.js';

export class GameService {
  constructor(private gameRepository: IGameRepository) {}

  async findById(id: string) {
    return this.gameRepository.findById(id);
  }

  async findAll(filters?: GameFilters) {
    return this.gameRepository.findAll(filters);
  }

  async create(data: IGameCreate, userId: string) {
    const existing = await this.gameRepository.findByTitle(data.title);
    if (existing) {
      throw new Error('Game already exists');
    }
    return this.gameRepository.create(data, userId);
  }

  async update(id: string, data: IGameUpdate, userId: string, userRole: string) {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.createdBy !== userId && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    return this.gameRepository.update(id, data, userId);
  }

  async delete(id: string, userId: string, userRole: string) {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.createdBy !== userId && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    return this.gameRepository.delete(id);
  }
}