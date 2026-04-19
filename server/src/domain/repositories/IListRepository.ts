import { IList, IListCreate, IListUpdate } from '../entities/IList.js';

export interface IListRepository {
  findById(id: string): Promise<IList | null>;
  findByUserId(userId: string): Promise<IList[]>;
  create(data: IListCreate): Promise<IList>;
  update(id: string, data: IListUpdate): Promise<IList | null>;
  delete(id: string): Promise<boolean>;
  addGame(listId: string, gameId: string): Promise<IList | null>;
  removeGame(listId: string, gameId: string): Promise<IList | null>;
}