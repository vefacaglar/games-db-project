import { IUserGameLibrary, IUserGameLibraryCreate, IUserGameLibraryUpdate } from '../../domain/entities/UserGameStatus.js';
import { UserGameLibraryModel, UserGameLibraryDocument } from '../database/schemas/UserGameLibrarySchema.js';
import mongoose from 'mongoose';

export class UserLibraryRepository {
  private mapToEntity(doc: UserGameLibraryDocument): IUserGameLibrary {
    return {
      _id: doc._id.toString(),
      user: doc.user.toString(),
      game: doc.game.toString(),
      status: doc.status as any,
      personalRating: doc.personalRating,
      personalNotes: doc.personalNotes,
      startedAt: doc.startedAt,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findByUserId(userId: string): Promise<IUserGameLibrary[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const docs = await UserGameLibraryModel.find({ user: objectId })
      .populate('game')
      .exec();
    return docs.map(this.mapToEntity);
  }

  async findByUserIdAndStatus(userId: string, status: string): Promise<IUserGameLibrary[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const docs = await UserGameLibraryModel.find({ user: objectId, status })
      .populate('game')
      .exec();
    return docs.map(this.mapToEntity);
  }

  async findByUserAndGame(userId: string, gameId: string): Promise<IUserGameLibrary | null> {
    const doc = await UserGameLibraryModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      game: new mongoose.Types.ObjectId(gameId)
    }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async create(data: IUserGameLibraryCreate): Promise<IUserGameLibrary> {
    const doc = await UserGameLibraryModel.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(data.user),
        game: new mongoose.Types.ObjectId(data.game)
      },
      { ...data, user: new mongoose.Types.ObjectId(data.user), game: new mongoose.Types.ObjectId(data.game) },
      { upsert: true, new: true }
    );
    return this.mapToEntity(doc);
  }

  async update(id: string, data: IUserGameLibraryUpdate): Promise<IUserGameLibrary | null> {
    const updateData: any = { ...data };
    if (data.status === 'completed' && !data.completedAt) {
      updateData.completedAt = new Date();
    }
    if (data.status === 'playing' && !data.startedAt) {
      updateData.startedAt = new Date();
    }
    
    const doc = await UserGameLibraryModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('game')
      .exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserGameLibraryModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async deleteByUserAndGame(userId: string, gameId: string): Promise<boolean> {
    const result = await UserGameLibraryModel.findOneAndDelete({
      user: new mongoose.Types.ObjectId(userId),
      game: new mongoose.Types.ObjectId(gameId)
    }).exec();
    return result !== null;
  }
}