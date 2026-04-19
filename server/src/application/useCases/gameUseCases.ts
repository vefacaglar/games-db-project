import { GameService } from '../../domain/services/GameService.js';
import { GameRepository } from '../../infrastructure/repositories/GameRepository.js';
import { CreateGameDTO, UpdateGameDTO, GameFiltersDTO } from '../dto/GameDTO.js';
import { IUser } from '../../domain/entities/IUser.js';

const gameRepository = new GameRepository();
const gameService = new GameService(gameRepository);

export async function getGames(filters?: GameFiltersDTO) {
  return gameService.findAll(filters);
}

export async function getGameById(id: string) {
  const game = await gameService.findById(id);
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
}

export async function createGame(data: CreateGameDTO, user: IUser) {
  return gameService.create(data, user._id);
}

export async function updateGame(id: string, data: UpdateGameDTO, user: IUser) {
  const game = await gameService.update(id, data, user._id, user.role);
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
}

export async function deleteGame(id: string, user: IUser) {
  const result = await gameService.delete(id, user._id, user.role);
  if (!result) {
    throw new Error('Game not found');
  }
  return { success: true };
}