import { IPlatformRepository } from '../../domain/repositories/IPlatformRepository.js';
import { IPlatform, IPlatformCreate } from '../../domain/entities/IPlatform.js';
import { PlatformModel, PlatformDocument } from '../database/schemas/PlatformSchema.js';

export class PlatformRepository implements IPlatformRepository {
  private mapToEntity(doc: PlatformDocument): IPlatform {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findById(id: string): Promise<IPlatform | null> {
    const doc = await PlatformModel.findById(id).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<IPlatform | null> {
    const doc = await PlatformModel.findOne({ slug }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<IPlatform[]> {
    const docs = await PlatformModel.find().exec();
    return docs.map(this.mapToEntity);
  }

  async create(data: IPlatformCreate): Promise<IPlatform> {
    const doc = await PlatformModel.create(data);
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await PlatformModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}