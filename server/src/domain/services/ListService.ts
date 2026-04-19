import { IListRepository } from '../repositories/IListRepository.js';
import { IListCreate, IListUpdate } from '../entities/IList.js';

export class ListService {
  constructor(private listRepository: IListRepository) {}

  async findById(id: string) {
    return this.listRepository.findById(id);
  }

  async findByUserId(userId: string) {
    return this.listRepository.findByUserId(userId);
  }

  async create(data: IListCreate) {
    return this.listRepository.create(data);
  }

  async update(id: string, data: IListUpdate, currentUserId: string) {
    const list = await this.listRepository.findById(id);
    if (!list) {
      throw new Error('List not found');
    }

    if (list.user !== currentUserId) {
      throw new Error('Unauthorized');
    }

    return this.listRepository.update(id, data);
  }

  async delete(id: string, currentUserId: string) {
    const list = await this.listRepository.findById(id);
    if (!list) {
      throw new Error('List not found');
    }

    if (list.user !== currentUserId) {
      throw new Error('Unauthorized');
    }

    return this.listRepository.delete(id);
  }

  async addGame(listId: string, gameId: string, currentUserId: string) {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new Error('List not found');
    }

    if (list.user !== currentUserId) {
      throw new Error('Unauthorized');
    }

    return this.listRepository.addGame(listId, gameId);
  }

  async removeGame(listId: string, gameId: string, currentUserId: string) {
    const list = await this.listRepository.findById(listId);
    if (!list) {
      throw new Error('List not found');
    }

    if (list.user !== currentUserId) {
      throw new Error('Unauthorized');
    }

    return this.listRepository.removeGame(listId, gameId);
  }
}