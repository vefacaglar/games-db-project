import { IGameRepository, GameFilters } from '../../domain/repositories/IGameRepository.js';
import { IGame, IGameCreate, IGameUpdate } from '../../domain/entities/IGame.js';
import { GameModel, GameDocument } from '../database/schemas/GameSchema.js';
import mongoose from 'mongoose';

export class GameRepository implements IGameRepository {
  private mapToEntity(doc: GameDocument): IGame {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      genre: doc.genre,
      platform: doc.platform,
      playTime: doc.playTime,
      coverImage: doc.coverImage,
      rating: doc.rating,
      createdBy: doc.createdBy.toString(),
      updatedBy: doc.updatedBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IGame | null> {
    const doc = await GameModel.findById(id).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByTitle(title: string): Promise<IGame | null> {
    const doc = await GameModel.findOne({ title }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(filters?: GameFilters): Promise<{ games: IGame[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (filters?.genre) {
      query.genre = filters.genre;
    }
    if (filters?.platform) {
      query.platform = { $in: [filters.platform] };
    }
    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      GameModel.find(query).skip(skip).limit(limit).exec(),
      GameModel.countDocuments(query).exec()
    ]);

    return {
      games: games.map(this.mapToEntity),
      total
    };
  }

  async create(data: IGameCreate, userId: string): Promise<IGame> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const doc = await GameModel.create({
      ...data,
      createdBy: objectId,
      updatedBy: objectId
    });
    return this.mapToEntity(doc);
  }

  async update(id: string, data: IGameUpdate, userId: string): Promise<IGame | null> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const doc = await GameModel.findByIdAndUpdate(
      id,
      { ...data, updatedBy: objectId },
      { new: true }
    ).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await GameModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}