import { IListRepository } from '../../domain/repositories/IListRepository.js';
import { IList, IListCreate, IListUpdate } from '../../domain/entities/IList.js';
import { ListModel, ListDocument } from '../database/schemas/ListSchema.js';
import mongoose from 'mongoose';

export class ListRepository implements IListRepository {
  private mapToEntity(doc: ListDocument): IList {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      user: doc.user.toString(),
      games: doc.games.map(id => id.toString()),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IList | null> {
    const doc = await ListModel.findById(id).populate('games').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<IList[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const docs = await ListModel.find({ user: objectId }).populate('games').exec();
    return docs.map(this.mapToEntity);
  }

  async create(data: IListCreate): Promise<IList> {
    const objectId = new mongoose.Types.ObjectId(data.user);
    const doc = await ListModel.create({
      name: data.name,
      user: objectId,
      games: data.games || []
    });
    return this.mapToEntity(doc);
  }

  async update(id: string, data: IListUpdate): Promise<IList | null> {
    const doc = await ListModel.findByIdAndUpdate(id, data, { new: true }).populate('games').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ListModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async addGame(listId: string, gameId: string): Promise<IList | null> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const doc = await ListModel.findByIdAndUpdate(
      listId,
      { $addToSet: { games: objectId } },
      { new: true }
    ).populate('games').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async removeGame(listId: string, gameId: string): Promise<IList | null> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const doc = await ListModel.findByIdAndUpdate(
      listId,
      { $pull: { games: objectId } },
      { new: true }
    ).populate('games').exec();
    return doc ? this.mapToEntity(doc) : null;
  }
}