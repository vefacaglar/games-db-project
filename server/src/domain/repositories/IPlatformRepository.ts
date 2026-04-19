import { IPlatform, IPlatformCreate } from '../entities/IPlatform.js';

export interface IPlatformRepository {
  findById(id: string): Promise<IPlatform | null>;
  findBySlug(slug: string): Promise<IPlatform | null>;
  findAll(): Promise<IPlatform[]>;
  create(data: IPlatformCreate): Promise<IPlatform>;
  delete(id: string): Promise<boolean>;
}