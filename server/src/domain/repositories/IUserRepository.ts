import { IUser, IUserCreate, IUserUpdate } from '../entities/IUser.js';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  create(data: IUserCreate): Promise<IUser>;
  update(id: string, data: IUserUpdate): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}