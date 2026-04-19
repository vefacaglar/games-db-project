import { IGame, IGameCreate, IGameUpdate } from '../entities/IGame.js';

export interface IGameRepository {
  findById(id: string): Promise<IGame | null>;
  findByTitle(title: string): Promise<IGame | null>;
  findAll(filters?: GameFilters): Promise<{ games: IGame[]; total: number }>;
  create(data: IGameCreate, userId: string): Promise<IGame>;
  update(id: string, data: IGameUpdate, userId: string): Promise<IGame | null>;
  delete(id: string): Promise<boolean>;
}

export interface GameFilters {
  genre?: string;
  platform?: string;
  search?: string;
  page?: number;
  limit?: number;
}