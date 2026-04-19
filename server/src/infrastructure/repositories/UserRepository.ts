import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IUser, IUserCreate, IUserUpdate } from '../../domain/entities/IUser.js';
import { UserModel, UserDocument } from '../database/schemas/UserSchema.js';

export class UserRepository implements IUserRepository {
  private mapToEntity(doc: UserDocument): IUser {
    return {
      _id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await UserModel.findById(id).select('-password').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ username }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<IUser[]> {
    const docs = await UserModel.find().select('-password').exec();
    return docs.map(this.mapToEntity);
  }

  async create(data: IUserCreate): Promise<IUser> {
    const doc = await UserModel.create(data);
    return this.mapToEntity(doc);
  }

  async update(id: string, data: IUserUpdate): Promise<IUser | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password').exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}